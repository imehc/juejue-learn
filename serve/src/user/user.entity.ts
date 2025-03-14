import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @Column({ comment: '姓名' })
  name: string;
  @Column({ comment: '年龄' })
  age: number;
}
