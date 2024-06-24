import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private readonly repository: Repository<MeetingRoom>;

  async findAll(
    name: string,
    capacity: number,
    equipment: string,
    limit: number,
    skip: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    skip = skip < 1 ? 1 : skip;
    const skipCount = (skip - 1) * limit;
    const condition: Record<string, any> = {};

    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }

    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: limit,
      where: condition,
    });

    return {
      meetingRooms,
      totalCount,
    };
  }

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: createMeetingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('会议室名字已存在');
    }
    try {
      await this.repository.insert(createMeetingRoomDto);
      return 'Created';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findById(id: number) {
    try {
      return await this.repository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.repository.findOneBy({ id });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }

    meetingRoom.capacity = updateMeetingRoomDto.capacity;
    meetingRoom.location = updateMeetingRoomDto.location;
    meetingRoom.name = updateMeetingRoomDto.name;

    if (updateMeetingRoomDto.description) {
      meetingRoom.description = updateMeetingRoomDto.description;
    }

    if (updateMeetingRoomDto.equipment) {
      meetingRoom.equipment = updateMeetingRoomDto.equipment;
    }
    try {
      await this.repository.update({ id: meetingRoom.id }, meetingRoom);
      return '更新会议室成功';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const meetingRoom = await this.repository.findOneBy({ id });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在或会议室已删除');
    }
    try {
      await this.repository.delete({ id });
      return 'Deleted';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
