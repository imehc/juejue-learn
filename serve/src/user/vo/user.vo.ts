import { UserSexEnum } from '../enums/user-sex.enum';

export class UserVo {
  id: number;
  username: string;
  nickname: string;
  phoneNumber: string;
  email: string;
  sex?: UserSexEnum;
  avatar?: string;
  createDate: Date;
  updateDate: Date;
}
