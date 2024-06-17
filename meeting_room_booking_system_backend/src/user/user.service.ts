import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UserDetailVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import {
  FORGOT_PASSWORD_CAPTCHA,
  REGISTER_CAPTCHA,
  UPDATE_PASSWORD_CAPTCHA,
  UPDATE_USER_CAPTCHA,
} from 'src/helper/consts';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { md5 } from 'src/helper/utils';
import { UserListVo } from './vo/user-list.vo';
import { ForgotUserPasswordDto } from './dto/forgot-user-password.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject(RedisService)
  private redisService: RedisService;

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(REGISTER_CAPTCHA(user.email));

    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }
    // 用户填写的验证码与redis验证码比较
    if (!captcha || user.captcha.toString() !== captcha) {
      this.redisService.del(REGISTER_CAPTCHA(user.email));
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const u = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (u) {
      this.redisService.del(REGISTER_CAPTCHA(user.email));
      throw new HttpException(
        '邮箱已存在，换个邮箱试试吧',
        HttpStatus.BAD_REQUEST,
      );
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      this.redisService.del(REGISTER_CAPTCHA(user.email));
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, UserService);
      throw new HttpException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      this.redisService.del(REGISTER_CAPTCHA(user.email));
    }
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
        isAdmin,
      },
      //级联查询 指示应该加载实体的哪些关系(简化左连接形式)。
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo(); // view object
    vo.userInfo = {
      id: user.id,
      username: user.username,
      nickName: user.nickName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      headPic: user.headPic,
      createAt: user.createAt,
      isFrozen: user.isFrozen,
      isAdmin: user.isAdmin,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        // 去重
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };

    return vo;
  }

  async findUserById(userId: number, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      email: user.email,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((arr, item) => {
        item.permissions.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async forgotPassword(passwordDto: ForgotUserPasswordDto) {
    const captcha = await this.redisService.get(
      FORGOT_PASSWORD_CAPTCHA(passwordDto.email),
    );

    if (!captcha || passwordDto.captcha.toString() !== captcha) {
      this.redisService.del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email));
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOne({
      where: { username: passwordDto.username },
    });
    if (!foundUser) {
      this.redisService.del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email));
      throw new HttpException('没有这个用户', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.email !== passwordDto.email) {
      this.redisService.del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email));
      throw new HttpException('邮箱与绑定邮箱不一致', HttpStatus.BAD_REQUEST);
    }

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      throw new HttpException('密码修改失败', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      this.redisService.del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email));
    }
  }

  async updatePassword(
    userId: number,
    address: string,
    passwordDto: UpdateUserPasswordDto,
  ) {
    const captcha = await this.redisService.get(
      UPDATE_PASSWORD_CAPTCHA(address),
    );

    if (!captcha || passwordDto.captcha.toString() !== captcha) {
      this.redisService.del(UPDATE_PASSWORD_CAPTCHA(address));
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    foundUser.password = md5(passwordDto.password);

    try {
      await this.userRepository.save(foundUser);
      return '密码修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      throw new HttpException('密码修改失败', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      this.redisService.del(UPDATE_PASSWORD_CAPTCHA(address));
    }
  }

  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createAt = user.createAt;
    vo.isFrozen = user.isFrozen;

    return vo;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const u = await this.findUserDetailById(userId);
    if (u.email !== updateUserDto.email) {
      this.redisService.del(UPDATE_USER_CAPTCHA(updateUserDto.email));
      throw new HttpException('邮箱与绑定邮箱不一致', HttpStatus.BAD_REQUEST);
    }

    const captcha = await this.redisService.get(
      UPDATE_USER_CAPTCHA(updateUserDto.email),
    );

    if (!captcha || updateUserDto.captcha.toString() !== captcha) {
      this.redisService.del(UPDATE_USER_CAPTCHA(updateUserDto.email));
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });

    // 更新昵称
    if (updateUserDto.nickName) {
      foundUser.nickName = updateUserDto.nickName;
    }
    // 更新头像
    if (updateUserDto.headPic) {
      foundUser.headPic = updateUserDto.headPic;
    }

    try {
      await this.userRepository.save(foundUser);
      return '用户信息修改成功';
    } catch (e) {
      this.logger.error(e, UserService);
      throw new HttpException(
        '用户信息修改失败',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.redisService.del(UPDATE_USER_CAPTCHA(updateUserDto.email));
    }
  }

  async freezeUserById(id: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user?.isFrozen) {
      throw new UnauthorizedException('你没有该权限冻结此用户');
    }
    const freezeUser = await this.userRepository.findOneBy({
      id,
    });
    freezeUser.isFrozen = true;

    await this.userRepository.save(freezeUser);
  }

  /** @deprecated */
  async findUsersByPage(limit: number, skip: number) {
    const skipCount = (skip - 1) * limit;
    // 查找与给定查找选项匹配的实体。还计算匹配给定条件的所有实体，但忽略分页设置(from和take选项)
    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'headPic',
        'createAt',
      ],
      skip: skipCount,
      take: limit,
    });
    const vo = new UserListVo();
    vo.users = users;
    vo.totalCount = totalCount;
    return vo;
  }

  async findUsers(
    username: string,
    nickName: string,
    email: string,
    limit: number,
    skip: number,
  ) {
    // TODO: 优雅处理参数
    limit = limit > 100 ? 100 : limit;
    skip = skip < 1 ? 1 : skip;
    const skipCount = (skip - 1) * limit;
    const condition: Record<string, any> = {};
    // 模糊搜索
    if (username) {
      condition.username = Like(`%${username}%`);
    }
    if (nickName) {
      condition.nickName = Like(`%${nickName}%`);
    }
    if (email) {
      condition.email = Like(`%${email}%`);
    }
    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'nickName',
        'email',
        'phoneNumber',
        'isFrozen',
        'headPic',
        'createAt',
      ],
      skip: skipCount,
      take: limit,
      where: condition,
    });

    const vo = new UserListVo();
    vo.users = users;
    vo.totalCount = totalCount;
    return vo;
  }

  async checkEmailIsExist(email: string) {
    return this.userRepository.exists({ where: { email } });
  }

  async initData() {
    const user1 = new User();
    user1.username = 'zhangsan';
    user1.password = md5('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';

    const user2 = new User();
    user2.username = 'lisi';
    user2.password = md5('222222');
    user2.email = 'yy@yy.com';
    user2.nickName = '李四';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';

    user1.roles = [role1];
    user2.roles = [role2];

    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];

    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
  }
}
