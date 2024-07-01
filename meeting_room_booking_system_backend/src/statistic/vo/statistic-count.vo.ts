import { ApiProperty } from '@nestjs/swagger';

export class StatisticCountVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: '次数' })
  count: number;
}
