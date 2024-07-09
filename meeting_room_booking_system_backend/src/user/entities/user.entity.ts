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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** 用户表实体 */
@Entity({
  name: 'users',
})
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    length: 50,
    comment: '用户名',
    unique: true,
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
    select: false,
  })
  password: string;

  @ApiPropertyOptional()
  @Column({
    name: 'nick_name',
    length: 50,
    comment: '昵称',
  })
  nickName: string;

  @ApiProperty()
  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @ApiPropertyOptional()
  @Column({
    length: 100,
    name: 'head_pic',
    nullable: true,
    comment: '头像',
  })
  headPic: string;

  @ApiPropertyOptional()
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
    select: false,
  })
  isFrozen: boolean;

  @Column({
    default: false,
    name: 'is_admin',
    comment: '是否是管理员',
    select: false,
  })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'update_at' })
  updateAt: Date;

  @ManyToMany(() => Role, { onDelete: 'CASCADE', cascade: true })
  @JoinTable({ name: 'user_roles' /** 中间表名称 */ })
  roles: Role[];

  @Column({
    type: 'int',
    comment: '登录类型, 0 用户名密码登录, 1 Google 登录, 2 Github 登录',
    default: 0,
  })
  loginType: LoginType;
}

export enum LoginType {
  USERNAME_PASSWORD = 0,
  GOOGLE,
  GITHUB,
}
