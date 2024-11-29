import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserInfo } from 'src/helper/custom.decorator';
import { UpdateUserDto } from './dto/update.dto';
import { UpdateUserEmailDto } from './dto/update-email.dto';
import { getSchemaPath } from '@nestjs/swagger';
import { CreateAt, UserInfo as User } from './vo/info.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiDoc } from 'src/helper/custom.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiDoc({
    operation: {
      description: '用户获取个人信息',
      operationId: 'findInfo',
      tags: ['user'],
    },
    extraModels: [CreateAt],
    response: {
      content: {
        'application/json': {
          schema: {
            allOf: [
              { $ref: getSchemaPath(User) },
              { $ref: getSchemaPath(CreateAt) },
            ],
          },
        },
      },
    },
  })
  @Get('info')
  public async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @ApiDoc({
    operation: {
      description: '用户修改密码',
      operationId: 'updatePassword',
      tags: ['user'],
    },
    response: { type: String, description: '修改密码成功' },
  })
  @Post('update-password')
  public async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordUserDto: UpdatePasswordDto,
  ) {
    await this.userService.updateUser({
      type: 'update-password',
      data: { id: userId, ...updatePasswordUserDto },
    });
    return '修改密码成功';
  }

  @ApiDoc({
    operation: {
      description: '用户更新信息',
      operationId: 'updateInfo',
      tags: ['user'],
    },
    response: { type: String, description: '修改成功' },
  })
  @Post('update')
  public async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser({
      type: 'update-user',
      data: { id: userId, ...updateUserDto },
    });
    return '修改成功';
  }

  @ApiDoc({
    operation: {
      description: '用户修改邮箱',
      operationId: 'updateEmail',
      tags: ['user'],
    },
    response: { type: String, description: '修改成功' },
  })
  @Post('update-email')
  public async updateEmail(
    @UserInfo('userId') userId: number,
    @Body() { email, captcha }: UpdateUserEmailDto,
  ) {
    await this.userService.updateUser({
      type: 'update-email',
      data: { id: userId, email },
      captcha,
    });
    return '修改邮箱成功';
  }
}
