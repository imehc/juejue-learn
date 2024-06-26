import { ApiProperty } from '@nestjs/swagger';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookingStatus {
  APPLY = 'apply',
  PASS = 'pass',
  REJECT = 'reject',
  UNBIND = 'unbind',
}

@Entity()
export class Booking {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    name: 'start_at',
    comment: '会议开始时间',
  })
  startAt: Date;

  @ApiProperty()
  @Column({
    name: 'end_at',
    comment: '会议结束时间',
  })
  endAt: Date;

  @ApiProperty({
    enum: BookingStatus,
    default: BookingStatus.APPLY,
    description: '状态（申请中、审批通过、审批驳回、已解除）',
  })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    comment: '状态（申请中、审批通过、审批驳回、已解除）',
    default: BookingStatus.APPLY,
  })
  status: BookingStatus;

  @ApiProperty()
  @Column({
    length: 100,
    comment: '备注',
    default: '',
  })
  remark: string;

  @ApiProperty()
  @ManyToOne(() => User)
  user: User;

  @ApiProperty()
  @ManyToOne(() => MeetingRoom)
  room: MeetingRoom;

  @ApiProperty()
  @CreateDateColumn({
    name: 'create_at',
    comment: '创建时间',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'update_at',
    comment: '更新时间',
  })
  updateAt: Date;
}
