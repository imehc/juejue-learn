import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ParseDatePipe } from 'src/helper/parse-date-pipe';
import { startOfDay, subDays } from 'date-fns';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { StatisticCountVo } from './vo/statistic-count.vo';
import { RequireLogin } from 'src/helper/custom.decorator';

@RequireLogin()
@Controller('statistic')
export class StatisticController {
  @Inject(StatisticService)
  private statisticService: StatisticService;

  @ApiBearerAuth()
  @ApiQuery({
    name: 'startAt',
    description: '开始时间(默认最近10天)',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'endAt',
    description: '结束时间(默认最近10天)',
    required: false,
    type: Date,
  })
  @ApiOkResponse({
    isArray: true,
    type: StatisticCountVo,
    description: '用户预定次数',
  })
  @ApiOperation({
    description: '用户预定次数统计',
    operationId: 'find-user-booking-count',
    tags: ['statistic'],
  })
  @Get('user-booking-count')
  async findUserBookignCount(
    @Query(
      'startAt',
      new DefaultValuePipe(() => startOfDay(subDays(new Date(), 10))), // 默认日期
      new ParseDatePipe(),
    )
    startAt: Date,
    @Query(
      'endAt',
      new DefaultValuePipe(() => startOfDay(new Date())),
      new ParseDatePipe(),
    )
    endAt: Date,
  ) {
    return (await this.statisticService.userBookingCount(startAt, endAt)).map(
      (item) => ({ ...item, count: +item.count }),
    );
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'startAt',
    description: '开始时间(默认最近10天)',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'endAt',
    description: '结束时间(默认最近10天)',
    required: false,
    type: Date,
  })
  @ApiOkResponse({
    isArray: true,
    type: StatisticCountVo,
    description: '会议室使用统计',
  })
  @ApiOperation({
    description: '会议室使用次数统计',
    operationId: 'find-meeting-room-used-count',
    tags: ['statistic'],
  })
  @Get('meeting-room-used-count')
  async findMeetingRoomUsedCount(
    @Query(
      'startAt',
      new DefaultValuePipe(() => startOfDay(subDays(new Date(), 10))),
      new ParseDatePipe(),
    )
    startAt: Date,
    @Query(
      'endAt',
      new DefaultValuePipe(() => startOfDay(new Date())),
      new ParseDatePipe(),
    )
    endAt: Date,
  ) {
    return (
      await this.statisticService.meetingRoomUsedCount(startAt, endAt)
    ).map((item) => ({ ...item, count: +item.count }));
  }
}
