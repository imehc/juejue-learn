import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: '会议室ID' })
  @IsNotEmpty({ message: '会议室名称不能为空' })
  @IsNumber()
  meetingRoomId: number;

  /** https://github.com/nestjs/nest/issues/631 */
  @ApiProperty({ description: '开始时间' })
  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty({ description: '结束时间' })
  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @ApiPropertyOptional({ description: '备注' })
  remark?: string;
}
