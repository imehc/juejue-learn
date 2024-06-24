import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MeetingRoom {
  @ApiProperty()
  @PrimaryGeneratedColumn({ comment: '会议室id' })
  id: number;

  @ApiProperty()
  @Column({ length: 50, comment: '会议室名字' })
  name: string;

  @ApiProperty()
  @Column({ comment: '会议室容量' })
  capacity: number;

  @ApiProperty()
  @Column({
    length: 50,
    comment: '会议室位置',
  })
  location: string;

  @ApiPropertyOptional()
  @Column({
    length: 50,
    default: '',
    comment: '设备',
  })
  equipment: string;

  @ApiPropertyOptional()
  @Column({
    length: 100,
    default: '',
    comment: '描述',
  })
  description: string;

  @ApiProperty()
  @Column({
    default: false,
    name: 'is_booked',
    comment: '是否被预订',
  })
  isBooked: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'create_at', comment: '创建时间' })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'update_at', comment: '更新时间' })
  updateAt: Date;
}
