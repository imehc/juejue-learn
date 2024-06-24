import { Module } from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { MeetingRoomController } from './meeting-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { MeetingRoomServiceMock } from './meeting-room.service.mock';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  controllers: [MeetingRoomController],
  providers: [MeetingRoomService, MeetingRoomServiceMock],
})
export class MeetingRoomModule {}
