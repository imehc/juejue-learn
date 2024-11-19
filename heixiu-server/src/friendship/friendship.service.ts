import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FriendAddDto } from './dto/add.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestStatus, User } from '@prisma/client';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger();

  public async add(friendAddDto: FriendAddDto, userId: number) {
    // 查找该用户是否存在
    const foundUser = await this.prismaService.user.findFirst({
      where: { id: friendAddDto.friendId },
    });
    if (!foundUser) {
      throw new BadRequestException('用户不存在');
    }
    // 检查是否是自己
    if (foundUser.id === userId) {
      throw new BadRequestException('不能添加自己');
    }
    // 查找是否已经是好友
    const foundFriend = await this.prismaService.friendship.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendAddDto.friendId },
          { friendId: userId, userId: friendAddDto.friendId },
        ],
      },
    });
    if (foundFriend) {
      throw new BadRequestException('已经是好友');
    }
    // 查找是否发送过请求
    const foundFriendRequest = await this.prismaService.friendRequest.findFirst(
      {
        where: { fromUserId: userId, toUserId: friendAddDto.friendId },
      },
    );
    if (foundFriendRequest) {
      throw new BadRequestException('已发送过申请,请勿重复发送');
    }
    try {
      await this.prismaService.friendRequest.create({
        data: {
          fromUserId: userId,
          toUserId: friendAddDto.friendId,
          reason: friendAddDto.reason,
          status: FriendRequestStatus.PENDING,
        },
      });
    } catch (error) {
      this.logger.error(error, FriendshipService);
      throw new InternalServerErrorException('内部错误');
    }
  }

  public async getFriendship(userId: number) {
    const friends = await this.prismaService.friendship.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
      },
    });
    const set = new Set<number>();
    for (const friend of friends) {
      set.add(friend.userId);
      set.add(friend.friendId);
    }
    const friendIds = [...set].filter((item) => item !== userId);
    const res: Pick<User, 'id' | 'username' | 'nickName' | 'email'>[] = [];

    for (const id of friendIds) {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: { id: true, username: true, nickName: true, email: true },
      });
      res.push(user);
    }
    return res;
  }

  public async findFriendRequest(userId: number) {
    return this.prismaService.friendRequest.findMany({
      where: {
        toUserId: userId,
      },
      select: {
        id: true,
        fromUserId: true,
        reason: true,
        status: true,
        createAt: true,
        updateAt: true,
      },
    });
  }

  public async rejectFriendRequest(userId: number, friendId: number) {
    if (!friendId) {
      throw new BadRequestException('好友不能为空');
    }
    if (friendId === userId) {
      throw new BadRequestException('好友不能为自己');
    }
    const foundFriendRequest = await this.prismaService.friendRequest.findFirst(
      {
        where: {
          fromUserId: userId,
          toUserId: friendId,
        },
      },
    );
    if (!foundFriendRequest) {
      throw new BadRequestException('该好友申请不存在');
    }
    if (foundFriendRequest.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('已处理该好友申请');
    }
    try {
      const row = await this.prismaService.friendRequest.updateMany({
        where: {
          fromUserId: friendId,
          toUserId: userId,
          status: FriendRequestStatus.PENDING,
        },
        data: {
          status: FriendRequestStatus.REJECTED,
        },
      });
      if (row.count === 0) {
        throw new BadRequestException('拒绝好友申请失败');
      }
    } catch (error) {
      this.logger.error(error, FriendshipService);
      throw new InternalServerErrorException('内部错误');
    }
  }

  public async agreeFriendRequest(userId: number, friendId: number) {
    if (!friendId) {
      throw new BadRequestException('好友不能为空');
    }
    if (friendId === userId) {
      throw new BadRequestException('好友不能为自己');
    }
    const foundFriendRequest = await this.prismaService.friendRequest.findFirst(
      {
        where: {
          fromUserId: friendId,
          toUserId: userId,
        },
      },
    );
    if (!foundFriendRequest) {
      throw new BadRequestException('该好友申请不存在');
    }
    if (foundFriendRequest.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('已处理该好友申请');
    }
    try {
      const row = await this.prismaService.friendRequest.updateMany({
        where: {
          fromUserId: friendId,
          toUserId: userId,
          status: FriendRequestStatus.PENDING,
        },
        data: {
          status: FriendRequestStatus.ACCEPTED,
        },
      });
      if (row.count === 0) {
        throw new BadRequestException('同意好友申请失败');
      }
    } catch (error) {
      this.logger.error(error, FriendshipService);
      throw new InternalServerErrorException('内部错误');
    }
    const res = await this.prismaService.friendship.findMany({
      where: { userId, friendId },
    });
    if (!res.length) {
      try {
        await this.prismaService.friendship.create({
          data: { userId, friendId },
        });
      } catch (error) {
        this.logger.error(error, FriendshipService);
        throw new InternalServerErrorException('内部错误');
      }
    }
  }

  public async deleteFriend(userId: number, friendId: number) {
    if (!friendId) {
      throw new BadRequestException('好友不能为空');
    }
    if (friendId === userId) {
      throw new BadRequestException('不能删除自己');
    }
    const foundFriend = await this.prismaService.friendship.findFirst({
      where: {
        userId,
        friendId,
      },
    });
    if (!foundFriend) {
      throw new BadRequestException('该用户不是您的好友');
    }
    try {
      // 单向删除
      const row = await this.prismaService.friendship.deleteMany({
        where: {
          userId,
          friendId,
        },
      });
      if (row.count === 0) {
        throw new BadRequestException('删除好友失败');
      }
    } catch (error) {
      this.logger.error(error, FriendshipService);
      throw new InternalServerErrorException('内部错误');
    }
  }
}
