import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { UpdateUserDto } from './dto/update.dto';
import { UpdateUserEmailDto } from './dto/update-email.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateAt, UserInfo as User } from './vo/info.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: '用户获取个人信息',
    operationId: 'findInfo',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiExtraModels(CreateAt)
  @ApiOkResponse({
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
  })
  @Get('info')
  @RequireLogin()
  public async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @ApiOperation({
    description: '用户修改密码',
    operationId: 'updatePassword',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({ description: '修改密码成功', type: String })
  @Post('update-password')
  @HttpCode(HttpStatus.OK)
  @RequireLogin()
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

  @ApiOperation({
    description: '用户更新信息',
    operationId: 'updateInfo',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: '修改成功', type: String })
  @HttpCode(HttpStatus.OK)
  @Post('update')
  @RequireLogin()
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

  @ApiOperation({
    description: '用户修改邮箱',
    operationId: 'updateEmail',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserEmailDto })
  @ApiOkResponse({ description: '修改成功', type: String })
  @Post('update-email')
  @HttpCode(HttpStatus.OK)
  @RequireLogin()
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
