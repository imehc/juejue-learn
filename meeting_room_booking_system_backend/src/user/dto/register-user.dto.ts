import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

// 可以用 @nestjs/mapped-types 的 PartialType、PickType、OmitType、IntersectionType 来灵活创建 dto
// PickType 是从已有 dto 类型中取某个字段
// OmitType 是从已有 dto 类型中去掉某个字段
// PartialType 是把 dto 类型变为可选
// 要想swagger正确识别 需要从 @nestjs/swagger 导入
// https://github.com/nestjs/swagger/issues/1074
export class RegisterUserDto extends PickType(LoginUserDto, [
  'username',
  'password',
]) {
  @IsNotEmpty({
    message: '昵称不能为空',
  })
  @ApiProperty()
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @ApiProperty()
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty()
  captcha: number;
}
