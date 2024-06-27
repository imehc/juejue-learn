import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { generateParseIntPipe } from 'src/helper/utils';
import { BookingList } from './vo/booking-list.vo';
import { UserInfo } from 'src/helper/custom.decorator';
import { BookingStatus } from './entities/booking.entity';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiBearerAuth()
  @ApiQuery({ name: 'skip', description: '第几页', type: Number })
  @ApiQuery({ name: 'limit', description: '每页多少条', type: Number })
  @ApiQuery({ name: 'username', description: '预定人', required: false })
  @ApiQuery({ name: 'name', description: '会议室名称', required: false })
  @ApiQuery({
    name: 'status',
    description: '审核状态',
    enum: BookingStatus,
    required: false,
  })
  @ApiQuery({
    name: 'location',
    description: '会议室预定地址',
    required: false,
  })
  @ApiQuery({
    name: 'startAt',
    description: '开始时间',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'endAt',
    description: '结束时间',
    required: false,
    type: Date,
  })
  @ApiOkResponse({ description: '预订列表', type: BookingList })
  @ApiOperation({
    description: '预订列表',
    operationId: 'find-all-booking',
    tags: ['booking'],
  })
  @Get('')
  async findAll(
    @Query('skip', new DefaultValuePipe(1), generateParseIntPipe('skip'))
    skip: number,
    @Query('limit', new DefaultValuePipe(2), generateParseIntPipe('limit'))
    limit: number,
    @Query('name') name: string,
    @Query('username') username: string,
    @Query('location') location: string,
    @Query('status') status: BookingStatus,
    @Query('startAt') startAt: Date,
    @Query('endAt') endAt: Date,
  ) {
    return this.bookingService.findAll(
      limit,
      skip,
      username,
      name,
      location,
      status,
      startAt,
      endAt,
    );
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateBookingDto })
  @ApiCreatedResponse({ description: '申请预订成功', type: String })
  @ApiOperation({
    description: '申请预订',
    operationId: 'create-booking',
    tags: ['booking'],
  })
  @Post()
  create(
    @Body() createBookingDto: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.bookingService.create(createBookingDto, +userId);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'bookingId', description: '预定id', type: Number })
  @ApiCreatedResponse({ description: '审批通过成功', type: String })
  @ApiOperation({
    description: '审批通过',
    operationId: 'pass-booking',
    tags: ['booking'],
  })
  @Patch(':bookingId/pass')
  pass(@Param('bookingId') id: number) {
    return this.bookingService.pass(+id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'bookingId', description: '预定id', type: Number })
  @ApiCreatedResponse({ description: '审批驳回成功', type: String })
  @ApiOperation({
    description: '审批驳回',
    operationId: 'reject-booking',
    tags: ['booking'],
  })
  @Patch(':bookingId/reject')
  reject(@Param('bookingId') id: number) {
    return this.bookingService.reject(+id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'bookingId', description: '预定id', type: Number })
  @ApiCreatedResponse({ description: '审批解除成功', type: String })
  @ApiOperation({
    description: '审批解除',
    operationId: 'unbind-booking',
    tags: ['booking'],
  })
  @Patch(':bookingId/unbind')
  unbind(@Param('bookingId') id: number) {
    return this.bookingService.unbind(+id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'bookingId', description: '预定id', type: Number })
  @ApiCreatedResponse({ description: '催办成功', type: String })
  @ApiOperation({
    description: '催办',
    operationId: 'urge-booking',
    tags: ['booking'],
  })
  @Get(':bookingId/urge')
  async urge(@Param('bookingId') id: number) {
    return this.bookingService.urge(id);
  }
}
