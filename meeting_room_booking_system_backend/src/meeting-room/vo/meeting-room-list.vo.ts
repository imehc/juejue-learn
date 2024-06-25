import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoom } from '../entities/meeting-room.entity';

export class MeetingRoomList {
  @ApiProperty({
    type: [MeetingRoom],
  })
  meetingRooms: MeetingRoom[];

  @ApiProperty()
  totalCount: number;
}
