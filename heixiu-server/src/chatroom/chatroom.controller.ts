import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { CreateSingleChatroomDto } from './dto/create-single.dto';
import { CreateMultipleChatroomDto } from './dto/create-multiple.dto';
import { ChatroomMemberQueryDto } from './dto/member-query.dto';
import { ChatroomMemberInfoDto } from './dto/info.dto';
import { ChatroomQueryDto } from './dto/query.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UserInfo as User } from '../user/vo/info.vo';
import { ChatRoom, ChatRoomUser, ChatRoomUserId } from './vo/room.vo';

@Controller('chatroom')
@RequireLogin()
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiOperation({
    description: '创建一对一聊天室',
    operationId: 'createOneToOneChatroom',
    tags: ['chatroom'],
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: '创建成功', type: String })
  @Post('single')
  public async createSingleChatroom(
    @Body() createSingleChatroom: CreateSingleChatroomDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.chatroomService.createSingleChatroom(
      userId,
      createSingleChatroom,
    );
    return '创建成功';
  }

  @ApiOperation({
    description: '创建多人聊天室',
    operationId: 'createMultipleChatroom',
    tags: ['chatroom'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateMultipleChatroomDto })
  @ApiOkResponse({ description: '创建成功', type: String })
  @Post('multiple')
  public async createMultipleChatroom(
    @Body() createMultipleChatroom: CreateMultipleChatroomDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.chatroomService.createMultipleChatroom(
      userId,
      createMultipleChatroom,
    );
    return '创建成功';
  }

  @ApiOperation({
    description: '获取聊天室成员',
    operationId: 'findChatroomMembers',
    tags: ['chatroom'],
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'chatroomId',
    type: Number,
    description: '聊天室id',
    example: 0,
  })
  @ApiOkResponse({ type: User, isArray: true })
  @Get('member')
  public async findChatroomMember(
    @Query() { chatroomId }: ChatroomMemberQueryDto,
  ) {
    return await this.chatroomService.findChatroomMember(chatroomId);
  }

  @ApiOperation({
    description: '获取所有聊天室',
    operationId: 'findAllChatroom',
    tags: ['chatroom'],
  })
  @ApiExtraModels(ChatRoom, ChatRoomUserId)
  @ApiBearerAuth()
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: {
          type: 'array',
          allOf: [
            { $ref: getSchemaPath(ChatRoom) },
            { $ref: getSchemaPath(ChatRoomUserId) },
          ],
        },
      },
    },
  })
  @Get()
  public async findAllChatroom(@UserInfo('userId') userId: number) {
    return await this.chatroomService.findAllChatroom(userId);
  }

  @ApiOperation({
    description: '获取单个聊天室详情',
    operationId: 'findOneChatroom',
    tags: ['chatroom'],
  })
  @ApiBearerAuth()
  @ApiExtraModels(ChatRoom, ChatRoomUser)
  @ApiParam({
    name: 'id',
    type: Number,
    description: '聊天室id',
    example: 0,
  })
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(ChatRoom) },
            { $ref: getSchemaPath(ChatRoomUser) },
          ],
        },
      },
    },
  })
  @Get(':id')
  public async findChatroom(@Param() { id }: ChatroomMemberInfoDto) {
    return await this.chatroomService.findChatroom(id);
  }

  @ApiOperation({
    description: '加入群聊',
    operationId: 'joinChatroom',
    tags: ['chatroom'],
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: '聊天室id',
    example: 0,
  })
  @ApiOkResponse({ description: '加入成功', type: String })
  @Put(':id/join')
  public async joinChatroom(
    @Param() { id }: ChatroomMemberInfoDto,
    @Query() { joinUserId }: ChatroomQueryDto,
    @UserInfo('userId') userId: number,
  ) {
    // TODO: 只有管理员才能使用joinUserId，普通成员不能传递joinUserId
    await this.chatroomService.joinChatroom(id, joinUserId || userId);
    return '加入成功';
  }

  @ApiOperation({
    description: '退出群聊',
    operationId: 'quitChatroom',
    tags: ['chatroom'],
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: '聊天室id',
    example: 0,
  })
  @ApiOkResponse({ description: '退出成功', type: String })
  @Put(':id/quit')
  public async quitChatroom(
    @Param() { id }: ChatroomMemberInfoDto,
    @UserInfo('userId') userId: number,
  ) {
    // TODO: 群管理是否可以退出 或者 需要先转让
    await this.chatroomService.quitChatroom(id, userId);
    return '退出成功';
  }
}
