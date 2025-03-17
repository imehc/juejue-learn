import { ApiProperty } from '@nestjs/swagger';
import {
  VRequired,
  VString,
  VPhoneNumber,
  VEmail,
} from 'src/common/validation.decorator';
import { UserSexEnum } from '../enums/user-sex.enum';

export class CreateUserDto {
  @ApiProperty({ description: '用户名称' })
  @VRequired()
  @VString()
  username: string;

  @ApiProperty({ description: '用户昵称' })
  @VRequired()
  @VString()
  nickname: string;

  @ApiProperty({ description: '手机号' })
  @VPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: '邮箱' })
  @VRequired()
  @VString()
  @VEmail()
  email: string;

  @ApiProperty({ description: '头像', nullable: true })
  avatar?: string;

  @ApiProperty({
    description: '性别',
    enum: UserSexEnum,
    enumName: 'UserSexEnum',
    nullable: true,
  })
  sex?: UserSexEnum;
}
