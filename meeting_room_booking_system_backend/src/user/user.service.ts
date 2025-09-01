import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { LoginType, User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Permission, UserInfo } from './vo/login-user.vo';
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

  @Inject(RedisService)
  private redisService: RedisService;

  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(REGISTER_CAPTCHA(user.email));

    // if (!captcha) {
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    // }
    // 用户填写的验证码与redis验证码比较
    if (!captcha || user.captcha.toString() !== captcha) {
      this.redisService.del(REGISTER_CAPTCHA(user.email)).catch((error) => {
        console.error('删除失败【用户注册-验证码不正确】', error);
      });
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const u = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (u) {
      this.redisService.del(REGISTER_CAPTCHA(user.email)).catch((error) => {
        console.error('删除失败【用户注册-邮箱已存在】', error);
      });
      throw new HttpException(
        '邮箱已存在，换个邮箱试试吧',
        HttpStatus.BAD_REQUEST,
      );
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      this.redisService.del(REGISTER_CAPTCHA(user.email)).catch((error) => {
        console.error('删除失败【用户注册-用户已存在】', error);
      });
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
      this.redisService.del(REGISTER_CAPTCHA(user.email)).catch((error) => {
        console.error('删除失败【用户注册-注册成功/失败】', error);
      });
    }
  }

  async registerByGoogle({
    email,
    nickName,
    headPic,
  }: Pick<RegisterUserDto, 'email' | 'nickName'> & {
    headPic: string;
  }) {
    const user = new User();
    user.email = email;
    user.nickName = nickName;
    user.headPic = headPic;
    user.password = '';
    user.username = email + Math.random().toString().slice(2, 10);
    user.loginType = LoginType.GOOGLE;
    user.isAdmin = false;

    const u = await this.userRepository.save(user);

    const info = new UserInfo();
    info.id = u.id;
    info.username = u.username;
    info.email = u.email;
    info.roles = [];
    info.permissions = [];
    return info;
  }

  async registerByGithub({
    username,
    headPic,
    nickName,
    email,
  }: Pick<RegisterUserDto, 'username' | 'email'> & {
    headPic: string;
    nickName: string;
  }) {
    const user = new User();
    user.email = email ?? '';
    user.nickName = nickName;
    user.headPic = headPic;
    user.password = '';
    user.username = username;
    user.loginType = LoginType.GITHUB;
    user.isAdmin = false;

    const u = await this.userRepository.save(user);

    const info = new UserInfo();
    info.id = u.id;
    info.username = u.username;
    info.email = u.email;
    info.roles = [];
    info.permissions = [];
    return info;
  }

  async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        password: true,
        isAdmin: true,
        email: true,
        nickName: true,
        phoneNumber: true,
        headPic: true,
        createAt: true,
        isFrozen: true,
        roles: true,
      },
      where: {
        username: loginUserDto.username,
        loginType: LoginType.USERNAME_PASSWORD,
        isAdmin,
      },
      // 级联查询 指示应该加载实体的哪些关系(简化左连接形式)。
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    if (user.isAdmin) {
      return this.handleUserTransformUserInfo(user);
    }
    // 普通用户
    const info = new UserInfo();
    info.id = user.id;
    info.username = user.username;
    info.email = user.email;
    info.roles = [];
    info.permissions = [];
    return info;
  }

  async findUserById(userId: number /** , isAdmin: boolean */) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        isAdmin: true,
        email: true,
        roles: true,
      },
      where: {
        id: userId,
        // isAdmin,
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
        return arr as Permission[];
      }, []),
    };
  }

  async findUserByEmail(email: string): Promise<UserInfo | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
        isAdmin: false,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (user) {
      // TODO: 通过email查询默认都是普通用户，所以不需要判断角色信息
      const info = new UserInfo();
      info.id = user.id;
      info.username = user.username;
      info.email = user.email;
      info.roles = [];
      info.permissions = [];
      return info;
    }
  }

  async findUserByUsername(username: string): Promise<UserInfo | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        username: username,
        isAdmin: false,
      },
      relations: ['roles', 'roles.permissions'],
    });
    if (user) {
      // TODO: 通过email查询默认都是普通用户，所以不需要判断角色信息
      const info = new UserInfo();
      info.id = user.id;
      info.username = user.username;
      info.email = user.email;
      info.roles = [];
      info.permissions = [];
      return info;
    }
  }

  async forgotPassword(passwordDto: ForgotUserPasswordDto) {
    const captcha = await this.redisService.get(
      FORGOT_PASSWORD_CAPTCHA(passwordDto.email),
    );

    if (!captcha || passwordDto.captcha.toString() !== captcha) {
      this.redisService
        .del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email))
        .catch((error) => {
          console.error('删除失败【忘记密码-验证码不正确】', error);
        });
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOne({
      where: { username: passwordDto.username },
    });
    if (!foundUser) {
      this.redisService
        .del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email))
        .catch((error) => {
          console.error('删除失败【忘记密码-没有这个用户】', error);
        });
      throw new HttpException('没有这个用户', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.email !== passwordDto.email) {
      this.redisService
        .del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email))
        .catch((error) => {
          console.error('删除失败【忘记密码-邮箱与绑定邮箱不一致】', error);
        });
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
      this.redisService
        .del(FORGOT_PASSWORD_CAPTCHA(passwordDto.email))
        .catch((error) => {
          console.error('删除失败【忘记密码-密码修改失败/成功】', error);
        });
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
      this.redisService.del(UPDATE_PASSWORD_CAPTCHA(address)).catch((error) => {
        console.error('删除失败【更新密码-验证码不正确】', error);
      });
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
      this.redisService.del(UPDATE_PASSWORD_CAPTCHA(address)).catch((error) => {
        console.error('删除失败【更新密码-密码修修改成功/失败】', error);
      });
    }
  }

  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        username: true,
        isAdmin: true,
        email: true,
        nickName: true,
        phoneNumber: true,
        headPic: true,
        createAt: true,
        isFrozen: true,
        roles: true,
      },
      where: {
        id: userId,
      },
      relations: ['roles', 'roles.permissions'], // 级联查询 指示应该加载实体的哪些关系(简化左连接形式)。
    });

    if (user.isAdmin) {
      return this.handleUserTransformUserInfo(user);
    }

    const vo = new UserDetailVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createAt = user.createAt;
    vo.isFrozen = user.isFrozen;
    vo.isAdmin = user.isAdmin;
    vo.type = 'normal';

    return vo;
  }

  async update(userId: number, address: string, updateUserDto: UpdateUserDto) {
    const captcha = await this.redisService.get(UPDATE_USER_CAPTCHA(address));

    if (!captcha || updateUserDto.captcha.toString() !== captcha) {
      this.redisService.del(UPDATE_USER_CAPTCHA(address)).catch((error) => {
        console.error('删除失败【更新用户-验证码不正确】', error);
      });
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
      this.redisService.del(UPDATE_USER_CAPTCHA(address)).catch((error) => {
        console.error('删除失败【更新用户-用户信息修改/失败】', error);
      });
    }
  }

  async freezeUserById(id: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { isAdmin: true },
    });
    if (!user?.isAdmin) {
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
    skip = skip < 0 ? 0 : skip;
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

  private handleUserTransformUserInfo(user: User): UserInfo {
    const userInfo = new UserInfo();
    userInfo.id = user.id;
    userInfo.username = user.username;
    userInfo.nickName = user.nickName;
    userInfo.email = user.email;
    userInfo.phoneNumber = user.phoneNumber;
    userInfo.headPic = user.headPic;
    userInfo.createAt = user.createAt;
    userInfo.isFrozen = user.isFrozen;
    userInfo.isAdmin = user.isAdmin;
    userInfo.roles = user.roles?.map((item) => item.name) ?? [];
    userInfo.permissions = (user.roles?.reduce((arr, item) => {
      // 去重
      item.permissions.forEach((permission) => {
        if (arr.indexOf(permission) === -1) {
          arr.push(permission);
        }
      });
      return arr as Permission[];
    }, []) ?? []) as Permission[];
    userInfo.type = 'system';

    return userInfo;
  }
}
