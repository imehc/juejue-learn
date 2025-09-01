import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { fakerZH_CN } from '@faker-js/faker';

@Injectable()
export class MeetingRoomServiceMock {
  @InjectRepository(MeetingRoom)
  private readonly repository: Repository<MeetingRoom>;

  mockMeetingRoom() {
    function fakeGalaxy() {
      const galaxies = [
        '土星',
        '火星',
        '地球',
        '金星',
        '木星',
        '天王星',
        '海王星',
        '冥王星',
      ];
      return fakerZH_CN.helpers.arrayElement(galaxies);
    }

    const room1 = new MeetingRoom();
    room1.name = fakeGalaxy();
    room1.capacity = fakerZH_CN.number.int({ min: 1, max: 50 });
    room1.equipment = fakerZH_CN.commerce.product();
    room1.location = fakerZH_CN.location.streetAddress();

    const room2 = new MeetingRoom();
    room2.name = fakeGalaxy();
    room2.capacity = fakerZH_CN.number.int({ min: 1, max: 50 });
    room2.equipment = fakerZH_CN.commerce.product();
    room2.location = fakerZH_CN.location.streetAddress();

    const room3 = new MeetingRoom();
    room3.name = fakeGalaxy();
    room3.capacity = fakerZH_CN.number.int({ min: 1, max: 50 });
    room3.equipment = fakerZH_CN.commerce.product();
    room3.location = fakerZH_CN.location.streetAddress();

    // 确定是插入或更新时，使用insert或update比save更好，可以避免额外查询一次
    this.repository.insert([room1, room2, room3]).catch(console.error);
  }

  /** 清空权限相关数据 */
  async clearMeetingRoom() {
    return await this.repository.clear();
  }
}
