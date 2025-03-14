import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  @InjectRepository(User)
  userModel: Repository<User>;

  getModel(): Repository<User> {
    return this.userModel;
  }

  create(user: CreateUserDto) {
    console.log(user);
  }

  update(id: number, user: UpdateUserDto) {
    console.log(id, user);
  }

  remove(id: number) {
    console.log(id);
  }
}
