import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Booking } from 'src/booking/entities/booking.entity';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { StatisticCountVo } from './vo/statistic-count.vo';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';

@Injectable()
export class StatisticService {
  @InjectEntityManager()
  private entityManager: EntityManager;

  async userBookingCount(startAt: Date, endAt: Date) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('u.id', 'id')
      .addSelect('u.username', 'name')
      .leftJoin(User, 'u', 'b.userId = u.id')
      .addSelect('count(1)', 'count')
      .where('b.startAt between :time1 and :time2', {
        time1: format(startAt, 'yyyy-MM-dd HH:mm:ss'),
        time2: format(endAt, 'yyyy-MM-dd HH:mm:ss'),
      })
      .addGroupBy('b.user')
      .getRawMany<StatisticCountVo>();
    return res;
  }

  async meetingRoomUsedCount(startAt: Date, endAt: Date) {
    const res = await this.entityManager
      .createQueryBuilder(Booking, 'b')
      .select('m.id', 'id')
      .addSelect('m.name', 'name')
      .leftJoin(MeetingRoom, 'm', 'b.roomId = m.id')
      .addSelect('count(1)', 'count')
      .where('b.startAt between :time1 and :time2', {
        time1: format(startAt, 'yyyy-MM-dd HH:mm:ss'),
        time2: format(endAt, 'yyyy-MM-dd HH:mm:ss'),
      })
      .addGroupBy('b.roomId')
      .getRawMany<StatisticCountVo>();
    return res;
  }
}
