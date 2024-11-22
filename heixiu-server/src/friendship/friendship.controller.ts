import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { FriendAddDto } from './dto/add.dto';

@Controller('friendship')
@RequireLogin()
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post()
  public async addFriend(
    @Body() friendAddDto: FriendAddDto,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.add(friendAddDto, userId);
    return '发送请求成功';
  }

  @Get()
  @RequireLogin()
  public async friendship(@UserInfo('userId') userId: number) {
    return await this.friendshipService.getFriendship(userId);
  }

  @Get('request')
  public async findFriendRequest(@UserInfo('userId') userId: number) {
    return this.friendshipService.findFriendRequest(userId);
  }

  @Put(':id/reject')
  public async rejectFriendRequest(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.rejectFriendRequest(userId, friendId);
    return '已拒绝该申请';
  }

  @Put(':id/agree')
  public async agreeFriendRequest(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.agreeFriendRequest(userId, friendId);
    return '已同意该申请';
  }

  @Delete(':id')
  public async deleteFriend(
    @Param('id') friendId: number,
    @UserInfo('userId') userId: number,
  ) {
    await this.friendshipService.deleteFriend(userId, friendId);
    return '删除成功';
  }
}
