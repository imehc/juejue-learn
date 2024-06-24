import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  HttpCode,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { generateParseIntPipe } from 'src/helper/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MeetingRoomList } from './vo/meeting-room-list.dto';
import { MeetingRoom } from './entities/meeting-room.entity';
import { RequireLogin } from 'src/helper/custom.decorator';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}

  @ApiBearerAuth()
  @ApiQuery({ name: 'skip', description: '第几页', type: Number })
  @ApiQuery({ name: 'limit', description: '每页多少条', type: Number })
  @ApiQuery({ name: 'name', description: '会议室名称', required: false })
  @ApiQuery({ name: 'capacity', description: '会议室容量', required: false })
  @ApiQuery({ name: 'equipment', description: '设备', required: false })
  @ApiOkResponse({ description: '会议室列表', type: MeetingRoomList })
  @ApiOperation({
    description: '会议室列表',
    operationId: 'find-all-metting-room',
    tags: ['meeting-room'],
  })
  @RequireLogin()
  @Get('')
  async list(
    @Query('skip', new DefaultValuePipe(1), generateParseIntPipe('skip'))
    skip: number,
    @Query('limit', new DefaultValuePipe(2), generateParseIntPipe('limit'))
    limit: number,
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
  ) {
    return this.meetingRoomService.findAll(
      name,
      capacity,
      equipment,
      limit,
      skip,
    );
  }

  @ApiBearerAuth()
  @ApiBody({ type: CreateMeetingRoomDto })
  @ApiCreatedResponse({ description: '会议室创建成功', type: String })
  @ApiOperation({
    description: '会议室创建',
    operationId: 'create-meeting-room',
    tags: ['meeting-room'],
  })
  @RequireLogin()
  @Post()
  async create(@Body() createMeetingRoomDto: CreateMeetingRoomDto) {
    return await this.meetingRoomService.create(createMeetingRoomDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: '查找会议室详情成功', type: MeetingRoom })
  @ApiOperation({
    description: '会议室详情',
    operationId: 'find-one-meeting-room',
    tags: ['meeting-room'],
  })
  @RequireLogin()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.meetingRoomService.findById(+id);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '会议室id', type: Number })
  @ApiBody({ type: UpdateMeetingRoomDto })
  @ApiOkResponse({ description: '会议室更新成功', type: String })
  @ApiOperation({
    description: '会议室更新',
    operationId: 'update-meeting-room',
    tags: ['meeting-room'],
  })
  @RequireLogin()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeetingRoomDto: UpdateMeetingRoomDto,
  ) {
    return this.meetingRoomService.update(+id, updateMeetingRoomDto);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '会议室id', type: Number })
  @ApiNoContentResponse({ description: '删除会议室成功', type: String })
  @ApiOperation({
    description: '删除会议室',
    operationId: 'del-meeting-room',
    tags: ['meeting-room'],
  })
  @RequireLogin()
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    return await this.meetingRoomService.remove(+id);
  }
}
