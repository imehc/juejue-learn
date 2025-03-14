import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';
import { omit } from 'utils/util';

@Entity('user')
export class User extends BaseEntity {
  @Column({ comment: '用户名称' })
  userName: string;
  @Column({ comment: '用户昵称' })
  nickName: string;
  @Column({ comment: '手机号' })
  phoneNumber: string;
  @Column({ comment: '邮箱' })
  email: string;
  @Column({ comment: '头像', nullable: true })
  avatar?: string;
  @Column({ comment: '性别（0:女，1:男）', nullable: true })
  sex?: number;
  @Column({ comment: '密码' })
  password: string;
  toVO() {
    return omit<User, keyof Pick<User, 'password'>>(this, ['password']);
  }
}
