import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  Between,
  EntityManager,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
} from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { addHours } from 'date-fns';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { ADMIN_EMAIL, URGE } from 'src/helper/consts';

@Injectable()
export class BookingService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  async findAll(
    limit: number,
    skip: number,
    username: string,
    name: string,
    location: string,
    startAt: Date,
    endAt: Date,
  ) {
    limit = limit > 100 ? 100 : limit;
    skip = skip < 1 ? 1 : skip;
    const skipCount = (skip - 1) * limit;
    const condition: Record<string, any> = {};

    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }

    if (name) {
      condition.room = {
        name: Like(`%${name}%`),
      };
    }

    if (location) {
      if (!condition.room) {
        condition.room = {};
      }
      condition.room.location = Like(`%${location}%`);
    }

    if (startAt) {
      if (!endAt) {
        endAt = addHours(startAt, 1);
      }
      condition.startTime = Between(new Date(startAt), new Date(endAt));
    }

    const [bookings, totalCount] = await this.entityManager.findAndCount(
      Booking,
      {
        where: condition,
        relations: {
          user: true,
          room: true,
        },
        skip: skipCount,
        take: limit,
      },
    );

    return {
      bookings,
      totalCount,
    };
  }

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.entityManager.findOneBy(MeetingRoom, {
      id: createBookingDto.meetingRoomId,
    });

    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    try {
      const user = await this.entityManager.findOneBy(User, {
        id: userId,
      });
      const booking = new Booking();
      booking.room = meetingRoom;
      booking.user = user;
      booking.startAt = new Date(createBookingDto.startAt);
      booking.endAt = new Date(createBookingDto.endAt);
      // 查询下已经预定的记录里有没有包含这段时间
      const res = await this.entityManager.findOneBy(Booking, {
        room: {
          id: meetingRoom.id,
        },
        startAt: LessThanOrEqual(booking.startAt),
        endAt: MoreThanOrEqual(booking.endAt),
      });

      if (res) {
        throw new BadRequestException('该时间段已被预定');
      }

      await this.entityManager.insert(Booking, booking);

      return 'Created';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async apply(id: number) {
    try {
      await this.entityManager.update(
        Booking,
        { id },
        { status: BookingStatus.PASS },
      );
      return '审批通过';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async reject(id: number) {
    try {
      await this.entityManager.update(
        Booking,
        { id },
        { status: BookingStatus.REJECT },
      );
      return '审批驳回';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unbind(id: number) {
    try {
      await this.entityManager.update(
        Booking,
        { id },
        { status: BookingStatus.UNBIND },
      );
      return '已解除';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  /** 发送催办邮件 */
  async urge(id: number) {
    const flag = await this.redisService.get(URGE(id.toString()));

    if (flag) {
      throw new BadRequestException('半小时内只能催办一次，请耐心等待');
    }

    try {
      let email = await this.redisService.get(ADMIN_EMAIL);
      if (!email) {
        const admin = await this.entityManager.findOne(User, {
          select: {
            email: true,
          },
          where: {
            isAdmin: true,
          },
        });
        email = admin.email;
        await this.redisService.set(ADMIN_EMAIL, admin.email);
        await this.emailService.sendMail({
          to: email,
          subject: '预定申请催办提醒',
          html: `id 为 ${id} 的预定申请正在等待审批`,
        });
        await this.redisService.set(URGE(id.toString()), 1, 60 * 30);
        return '催办成功';
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
