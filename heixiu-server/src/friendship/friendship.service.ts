import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AddFriendDto } from './dto/add.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestStatus, User } from '@prisma/client';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger(FriendshipService.name);

  public async add(friend: AddFriendDto, userId: number) {
    // 查找该用户是否存在
    const foundUser = await this.prismaService.user.findFirst({
      where: { id: friend.friendId },
    });
    if (!foundUser) {
      throw new BadRequestException('用户不存在');
    }
    // 检查是否是自己
    if (foundUser.id === userId) {
      throw new BadRequestException('不能添加自己');
    }
    // 查找是否已经是好友
    const foundFriend = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          { userId, friendId: friend.friendId },
          { friendId: userId, userId: friend.friendId },
        ],
      },
    });
    if (foundFriend.length >= 2) {
      throw new BadRequestException('已经是好友');
    }
    // 查找是否发送过请求
    const foundFriendRequest = await this.prismaService.friendRequest.findFirst(
      {
        where: { fromUserId: userId, toUserId: friend.friendId },
      },
    );
    if (foundFriendRequest?.status === FriendRequestStatus.PENDING) {
      throw new BadRequestException('已发送过申请,请勿重复发送');
    }
    try {
      if (foundFriendRequest?.id) {
        await this.prismaService.friendRequest.update({
          where: { id: foundFriendRequest.id },
          data: {
            reason: friend.reason,
            status: FriendRequestStatus.PENDING,
            updateAt: new Date(),
          },
        });
        return;
      }
      await this.prismaService.friendRequest.create({
        data: {
          fromUserId: userId,
          toUserId: friend.friendId,
          reason: friend.reason,
          status: FriendRequestStatus.PENDING,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('服务异常');
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
    const res: Pick<
      User,
      'id' | 'username' | 'nickname' | 'email' | 'headPic'
    >[] = [];

    for (const id of friendIds) {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          nickname: true,
          email: true,
          headPic: true,
        },
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
      this.logger.error(error);
      throw new InternalServerErrorException('服务异常');
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
      const rows = await this.prismaService.$transaction([
        // 双向添加，双方都是朋友
        this.prismaService.friendRequest.updateMany({
          where: {
            fromUserId: friendId,
            toUserId: userId,
            status: FriendRequestStatus.PENDING,
          },
          data: {
            status: FriendRequestStatus.ACCEPTED,
          },
        }),
        this.prismaService.friendRequest.updateMany({
          where: {
            fromUserId: userId,
            toUserId: friendId,
            status: FriendRequestStatus.PENDING,
          },
          data: {
            status: FriendRequestStatus.ACCEPTED,
          },
        }),
      ]);
      if (rows.every((item) => item.count === 0)) {
        throw new BadRequestException('同意好友申请失败');
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('服务异常');
    }
    const friendships = await this.prismaService.friendship.findMany({
      where: {
        OR: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    if (friendships.length >= 2) {
      throw new BadRequestException('已经是好友');
    }
    // 双向好友，最多只能有两个
    try {
      if (!friendships.length) {
        await this.prismaService.$transaction([
          // 双向添加，双方都是好友
          this.prismaService.friendship.create({
            data: { userId, friendId },
          }),
          this.prismaService.friendship.create({
            data: { userId: friendId, friendId: userId },
          }),
        ]);
      } else if (friendships.length === 1) {
        // 更新为双向好友
        const friendship = friendships.at(0);
        await this.prismaService.friendship.create({
          data: { userId: friendship.friendId, friendId: friendship.userId },
        });
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('服务异常');
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
      this.logger.error(error);
      throw new InternalServerErrorException('服务异常');
    }
  }
}
