import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/base.service';

@Injectable()
export class UserService extends BaseService<User> {
  @InjectRepository(User)
  userModel: Repository<User>;

  getModel(): Repository<User> {
    return this.userModel;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
