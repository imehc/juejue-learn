import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { CreateSingleChatroomDto } from './dto/create-single.dto';
import { CreateMultipleChatroomDto } from './dto/create-multiple.dto';
import { ChatroomMemberQueryDto } from './dto/member-query.dto';
import { ChatroomMemberInfoDto } from './dto/info.dto';
import { ChatroomQueryDto } from './dto/query.dto';

@Controller('chatroom')
@RequireLogin()
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

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

  @Get('member')
  public async findChatroomMember(
    @Query() { chatroomId }: ChatroomMemberQueryDto,
  ) {
    return await this.chatroomService.findChatroomMember(chatroomId);
  }

  @Get()
  public async findAllChatroom(@UserInfo('userId') userId: number) {
    return await this.chatroomService.findAllChatroom(userId);
  }

  @Get(':id')
  public async findChatroom(@Param() { id }: ChatroomMemberInfoDto) {
    return await this.chatroomService.findChatroom(id);
  }

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

  @Put(':id/quit')
  public async quitChatroom(
    @Param() { id }: ChatroomMemberInfoDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.chatroomService.quitChatroom(id, userId);
    return '退出成功';
  }
}
