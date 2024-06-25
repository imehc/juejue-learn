import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: '会议室ID' })
  @IsNotEmpty({ message: '会议室名称不能为空' })
  @IsNumber()
  meetingRoomId: number;

  @ApiProperty({ description: '开始时间' })
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsNumber()
  startAt: Date;

  @ApiProperty({ description: '结束时间' })
  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsNumber()
  endAt: Date;

  @ApiPropertyOptional({ description: '备注' })
  remark: string;
}
