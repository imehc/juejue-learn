import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { E } from 'src/common/base.exception';

@Controller('user')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get()
  get() {
    E.UnprocessableEntity('出错了');
  }

  @Post()
  create(@Body() body: UserDto): string {
    return JSON.stringify(body);
  }
}
