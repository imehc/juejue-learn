import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
import { omit } from 'utils/util';
import { UserVo } from '../vo/user.vo';

@Entity('user')
export class User extends BaseEntity {
  @Column({ comment: '用户名称' })
  username: string;
  @Column({ comment: '用户昵称' })
  nickname: string;
  @Column({ comment: '手机号' })
  phoneNumber: string;
  @Column({ comment: '邮箱' })
  email: string;
  @Column({ comment: '头像', nullable: true })
  avatar?: string;
  @Column({ comment: '性别（0:女，1:男）', nullable: true })
  sex?: number;
  @Column({ comment: '密码' })
  password?: string;

  toVO?(): UserVo {
    return omit<User, keyof Pick<User, 'password'>>(this, [
      'password',
    ]) as unknown as UserVo;
  }
}
