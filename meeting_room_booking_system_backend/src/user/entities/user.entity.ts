import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

/** 用户表实体 */
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 100,
    name: 'head_pic',
    nullable: true,
    comment: '头像',
  })
  headPic: string;

  @Column({
    length: 20,
    name: 'phone_number',
    nullable: true,
    comment: '手机号',
  })
  phoneNumber: string;

  @Column({
    default: false,
    name: 'is_frozen',
    comment: '是否冻结',
  })
  isFrozen: boolean;

  @Column({
    default: false,
    name: 'is_admin',
    comment: '是否是管理员',
  })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @ManyToMany(() => Role, { onDelete: 'CASCADE', cascade: true })
  @JoinTable({ name: 'user_roles' /** 中间表名称 */ })
  roles: Role[];
}
