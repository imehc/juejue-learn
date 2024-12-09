import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ApiDoc, UserInfo } from 'src/helper/custom.decorator';
import { CreateSingleChatroomDto } from './dto/create-single.dto';
import { CreateMultipleChatroomDto } from './dto/create-multiple.dto';
import { ChatroomMemberQueryDto } from './dto/member-query.dto';
import { ChatroomMemberInfoDto } from './dto/info.dto';
import { ChatroomQueryDto } from './dto/query.dto';
import { getSchemaPath } from '@nestjs/swagger';
import { UserInfo as User } from '../user/vo/info.vo';
import { ChatRoom, ChatRoomUser, ChatRoomUserId } from './vo/room.vo';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @ApiDoc({
    operation: {
      description: '创建一对一聊天室',
      operationId: 'createOneToOneChatroom',
      tags: ['chatroom'],
    },
    response: {
      type: String,
      description: '创建成功',
      status: HttpStatus.CREATED,
    },
  })
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

  @ApiDoc({
    operation: {
      description: '创建多人聊天室',
      operationId: 'createMultipleChatroom',
      tags: ['chatroom'],
    },
    response: {
      type: String,
      description: '创建成功',
      status: HttpStatus.CREATED,
    },
  })
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

  @ApiDoc({
    operation: {
      description: '获取聊天室成员',
      operationId: 'findChatroomMembers',
      tags: ['chatroom'],
    },
    response: { type: User, isArray: true },
  })
  @Get('member')
  public async findChatroomMember(
    @Query() { chatroomId }: ChatroomMemberQueryDto,
  ) {
    return await this.chatroomService.findChatroomMember(chatroomId);
  }

  @ApiDoc({
    operation: {
      description: '获取所有聊天室',
      operationId: 'findAllChatroom',
      tags: ['chatroom'],
    },
    extraModels: [ChatRoom, ChatRoomUserId],
    response: {
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
    },
  })
  @Get()
  public async findAllChatroom(@UserInfo('userId') userId: number) {
    return await this.chatroomService.findAllChatroom(userId);
  }

  @ApiDoc({
    operation: {
      description: '获取单个聊天室详情',
      operationId: 'findOneChatroom',
      tags: ['chatroom'],
    },
    extraModels: [ChatRoom, ChatRoomUser],
    response: {
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
    },
  })
  @Get(':id')
  public async findChatroom(@Param() { id }: ChatroomMemberInfoDto) {
    return await this.chatroomService.findChatroom(id);
  }

  @ApiDoc({
    operation: {
      description: '加入群聊',
      operationId: 'joinChatroom',
      tags: ['chatroom'],
    },
    response: { type: String, description: '加入成功' },
  })
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

  @ApiDoc({
    operation: {
      description: '退出群聊',
      operationId: 'quitChatroom',
      tags: ['chatroom'],
    },
    response: { type: String, description: '退出成功' },
  })
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
