import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { UserInfo } from 'src/helper/custom.decorator';
import { AddFriendDto } from './dto/add.dto';
import { UserInfo as User } from '../user/vo/info.vo';
import { FriendApplication } from './vo/request.vo';
import { ApiDoc } from 'src/helper/custom.decorator';
import { RejectFriendDto } from './dto/reject.dto';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @ApiDoc({
    operation: {
      description: '添加好友',
      operationId: 'addFriend',
      tags: ['friendship'],
    },
    response: {
      type: String,
      description: '发送好友申请成功',
      status: HttpStatus.CREATED,
    },
  })
  @Post()
  public async addFriend(
    @Body() friend: AddFriendDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.add(friend, userId);
    return '发送好友申请成功';
  }

  @ApiDoc({
    operation: {
      description: '获取好友列表',
      operationId: 'findFriendList',
      tags: ['friendship'],
    },
    response: { type: User, isArray: true },
  })
  @Get()
  public async friendship(@UserInfo('userId') userId: number) {
    return await this.friendshipService.getFriendship(userId);
  }

  @ApiDoc({
    operation: {
      description: '获取好友申请列表',
      operationId: 'findFriendRequestList',
      tags: ['friendship'],
    },
    response: { type: FriendApplication, isArray: true },
  })
  @Get('request')
  public async findFriendRequest(@UserInfo('userId') userId: number) {
    return this.friendshipService.findFriendRequest(userId);
  }

  @ApiDoc({
    operation: {
      description: '拒绝好友申请',
      operationId: 'rejectFriendRequest',
      tags: ['friendship'],
    },
    response: { type: String, description: '拒绝该申请成功' },
  })
  @Put(':id/reject')
  public async rejectFriendRequest(
    @Param() { id: friendId }: RejectFriendDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.rejectFriendRequest(userId, friendId);
    return '拒绝该申请成功';
  }

  @ApiDoc({
    operation: {
      description: '同意好友申请',
      operationId: 'agreeFriendRequest',
      tags: ['friendship'],
    },
    response: { type: String, description: '同意该申请成功' },
  })
  @Put(':id/agree')
  public async agreeFriendRequest(
    @Param() { id: friendId }: RejectFriendDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.agreeFriendRequest(userId, friendId);
    return '同意该申请成功';
  }

  @ApiDoc({
    operation: {
      description: '删除好友',
      operationId: 'delectFriend',
      tags: ['friendship'],
    },
    response: {
      type: String,
      description: '删除成功',
      status: HttpStatus.NO_CONTENT,
    },
  })
  @Delete(':id')
  public async deleteFriend(
    @Param() { id: friendId }: RejectFriendDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.deleteFriend(userId, friendId);
    return '删除成功';
  }
}
