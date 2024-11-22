import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateMultipleChatroomDto } from './dto/create-multiple.dto';
import { CreateSingleChatroomDto } from './dto/create-single.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Chatroom, ChatroomType, User } from '@prisma/client';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  private readonly logger = new Logger();

  /** 创建单聊 */
  public async createSingleChatroom(
    userId: number,
    singleChatroom: CreateSingleChatroomDto,
  ) {
    // 查找单聊判断是否创建
    const res: { id: number }[] = await this.prismaService.$queryRaw`
      SELECT u.chatroom_id as id
      FROM user_chatrooms u
      JOIN chatrooms c ON u.chatroom_id = c.id
      WHERE user_id = ${userId}
      AND c.type = 'SINGLE'
      AND EXISTS (
        -- 至少有一条
        SELECT 1 
        FROM user_chatrooms u
        WHERE user_id = ${singleChatroom.friendId} AND chatroom_id = u.chatroom_id
      )
    `;
    if (res.length > 0) {
      throw new BadRequestException('已存在该聊天室');
    }

    try {
      await this.prismaService.$transaction(async (tx) => {
        const { id } = await tx.chatroom.create({
          data: {
            // TODO: 支持使用好友的名称
            name: `聊天室${Math.random().toString().slice(2, 8)}`,
          },
          select: {
            id: true,
          },
        });
        await tx.userChatroom.create({
          data: { userId, chatroomId: id },
        });
        await tx.userChatroom.create({
          data: { userId: singleChatroom.friendId, chatroomId: id },
        });
      });
    } catch (error) {
      this.logger.error(error, ChatroomService);
      throw new InternalServerErrorException('服务异常');
    }
  }

  /** 创建聊天室 */
  public async createMultipleChatroom(
    userId: number,
    multipleChatroom: CreateMultipleChatroomDto,
  ) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const { id } = await tx.chatroom.create({
          data: {
            name: multipleChatroom.name,
            type: ChatroomType.MULTIPLE,
          },
          select: {
            id: true,
          },
        });
        await tx.userChatroom.create({
          data: { userId, chatroomId: id },
        });
      });
    } catch (error) {
      this.logger.error(error, ChatroomService);
      throw new InternalServerErrorException('服务异常');
    }
  }

  /** 查询所有聊天室 */
  public async findAllChatroom(userId: number) {
    // 查询当前用户下所有的聊天室
    // type Result = Pick<Chatroom, 'id'>;
    // const res: Result[] = await this.prismaService.$queryRaw`
    //   SELECT c.id, c.name, c.type , c.created_at as "createAt"
    //   FROM chatrooms c
    //   JOIN user_chatrooms u ON c.id = u.chatroom_id
    //   WHERE u.user_id = ${userId}
    // `;

    type Room = Pick<Chatroom, 'id' | 'name' | 'type' | 'createAt'> & {
      userIds: number[];
    };
    const rooms: Room[] = [];
    const chatrooms = await this.prismaService.chatroom.findMany({
      where: {
        id: {
          in: (
            await this.prismaService.userChatroom.findMany({
              where: { userId },
              select: { chatroomId: true },
            })
          ).map((item) => item.chatroomId),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        createAt: true,
      },
    });
    for (const item of chatrooms) {
      const userIds = await this.prismaService.userChatroom.findMany({
        where: { chatroomId: item.id },
        select: { userId: true },
      });
      rooms.push({
        ...item,
        userIds: userIds.map((item) => item.userId),
      });
    }
    return rooms;
  }

  /** 查询聊天室详情 */
  public async findChatroom(id: number) {
    type Room = Pick<Chatroom, 'id' | 'name' | 'type' | 'createAt'> & {
      users: Pick<User, 'id' | 'username' | 'nickname' | 'email' | 'headPic'>[];
    };
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: { id },
      select: { id: true, name: true, type: true, createAt: true },
    });
    if (!chatroom) {
      throw new BadRequestException('聊天室不存在');
    }
    return {
      ...chatroom,
      users: await this.findChatroomMember(id),
    } satisfies Room;
  }

  /** 查询聊天室成员 */
  public async findChatroomMember(chatroomId: number) {
    // TODO: 是否需要过滤单聊或者不包含该用户的聊天室？
    type Result = Pick<
      User,
      'id' | 'username' | 'nickname' | 'email' | 'headPic'
    >;
    const res: Result[] = await this.prismaService.$queryRaw`
      SELECT u.id, u.username, u.nickname, u.email, u.head_pic as headPic
      FROM users u
      JOIN user_chatrooms uc ON uc.user_id = u.id
      WHERE uc.chatroom_id = ${chatroomId}
    `;
    return res;
  }

  public async joinChatroom(id: number, joinUserId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: { id },
    });
    if (!chatroom) {
      throw new BadRequestException('该聊天室不存在');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: joinUserId },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (chatroom.type === ChatroomType.SINGLE) {
      throw new BadRequestException('一对一聊天室不能加人');
    }
    const checkExist = await this.prismaService.userChatroom.findFirst({
      where: { chatroomId: id, userId: joinUserId },
    });
    if (checkExist) {
      throw new BadRequestException('该聊天室已存在该用户');
    }

    try {
      await this.prismaService.$transaction([
        this.prismaService.userChatroom.create({
          data: { userId: joinUserId, chatroomId: id },
        }),
      ]);
    } catch (error) {
      throw new InternalServerErrorException('服务异常');
    }
  }

  public async quitChatroom(id: number, userId: number) {
    const chatroom = await this.prismaService.chatroom.findUnique({
      where: { id },
    });
    if (!chatroom) {
      throw new BadRequestException('该聊天室不存在');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (chatroom.type === ChatroomType.SINGLE) {
      throw new BadRequestException('一对一聊天室不能退出');
    }

    const checkExist = await this.prismaService.userChatroom.findFirst({
      where: { chatroomId: id, userId: userId },
    });
    if (!checkExist) {
      throw new BadRequestException('该用户不在该聊天室内');
    }

    try {
      await this.prismaService.$transaction([
        this.prismaService.userChatroom.deleteMany({
          where: { userId, chatroomId: id },
        }),
      ]);
    } catch (error) {
      throw new InternalServerErrorException('服务异常');
    }
  }
}
