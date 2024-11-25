import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { AddFriendDto } from './dto/add.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { UserInfo as User } from '../user/vo/info.vo';
import { FriendApplication } from './vo/request.vo';

@Controller('friendship')
@RequireLogin()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @ApiOperation({
    description: '添加好友',
    operationId: 'addFriend',
    tags: ['friendship'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: AddFriendDto })
  @ApiResponse({
    description: '发送好友申请成功',
    type: String,
    status: HttpStatus.CREATED,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  public async addFriend(
    @Body() friend: AddFriendDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.add(friend, userId);
    return '发送好友申请成功';
  }

  @ApiOperation({
    description: '获取好友列表',
    operationId: 'findFriendList',
    tags: ['friendship'],
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: User, isArray: true })
  @Get()
  public async friendship(@UserInfo('userId') userId: number) {
    return await this.friendshipService.getFriendship(userId);
  }

  @ApiOperation({
    description: '获取好友申请列表',
    operationId: 'findFriendRequestList ',
    tags: ['friendship'],
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: FriendApplication, isArray: true })
  @Get('request')
  public async findFriendRequest(@UserInfo('userId') userId: number) {
    return this.friendshipService.findFriendRequest(userId);
  }

  @ApiOperation({
    description: '拒绝好友申请',
    operationId: 'rejectFriendRequest',
    tags: ['friendship'],
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: '用户id',
    example: 0,
  })
  @ApiOkResponse({ description: '拒绝该申请成功', type: String })
  @HttpCode(HttpStatus.OK)
  @Put(':id/reject')
  public async rejectFriendRequest(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.rejectFriendRequest(userId, friendId);
    return '拒绝该申请成功';
  }

  @ApiOperation({
    description: '同意好友申请',
    operationId: 'agreeFriendRequest',
    tags: ['friendship'],
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: '用户id',
    example: 0,
  })
  @ApiOkResponse({ description: '同意该申请成功', type: String })
  @HttpCode(HttpStatus.OK)
  @Put(':id/agree')
  public async agreeFriendRequest(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.agreeFriendRequest(userId, friendId);
    return '同意该申请成功';
  }

  @ApiOperation({
    description: '删除好友',
    operationId: 'delectFriend',
    tags: ['friendship'],
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: '用户id',
    example: 0,
  })
  @ApiResponse({
    description: '删除成功',
    type: String,
    status: HttpStatus.NO_CONTENT,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async deleteFriend(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.deleteFriend(userId, friendId);
    return '删除成功';
  }
}
