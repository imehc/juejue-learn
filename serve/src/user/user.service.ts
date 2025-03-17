import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserVo } from './vo/user.vo';
import { E } from 'src/common/base.exception';
import { omit } from 'utils/util';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UserService extends BaseService<User> {
  @InjectRepository(User)
  userModel: Repository<User>;

  getModel(): Repository<User> {
    return this.userModel;
  }

  async create(entity: User): Promise<UserVo> {
    const { username, phoneNumber, email } = entity;
    let isExist = (await this.userModel.countBy({ username })) > 0;
    if (isExist) {
      E.BadRequest('当前用户名已存在');
    }

    isExist = (await this.userModel.countBy({ phoneNumber })) > 0;

    if (isExist) {
      E.BadRequest('当前手机号已存在');
    }

    isExist = (await this.userModel.countBy({ email })) > 0;

    if (isExist) {
      E.BadRequest('当前邮箱已存在');
    }

    // 添加用户的默认密码是123456，对密码进行加盐加密
    const password = hashSync('123456', 10);

    entity.password = password;

    await this.userModel.save(entity);

    // 把entity中的password移除返回给前端
    return omit(entity, ['password']) as unknown as UserVo;
  }

  async edit(entity: User): Promise<void | UserVo> {
    const { username, phoneNumber, email, id } = entity;
    let user = await this.userModel.findOneBy({ username });

    if (user && user.id !== id) {
      E.BadRequest('当前用户名已存在');
    }

    user = await this.userModel.findOneBy({ phoneNumber });

    if (user && user.id !== id) {
      E.BadRequest('当前手机号已存在');
    }

    user = await this.userModel.findOneBy({ email });

    if (user && user.id !== id) {
      E.BadRequest('当前邮箱已存在');
    }

    await this.userModel.save(entity);

    return omit(entity, ['password']) as unknown as UserVo;
  }
}
