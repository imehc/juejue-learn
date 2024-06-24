import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { md5 } from 'src/helper/utils';
import { faker, fakerZH_CN } from '@faker-js/faker';

@Injectable()
export class UserServiceMock {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  async mockUsers() {
    const role1 = new Role(); // 模拟数据
    role1.name = '管理员';
    const role2 = new Role(); // 模拟数据
    role2.name = '普通用户';

    const permission1 = new Permission(); // 模拟数据
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';

    const permission2 = new Permission(); // 模拟数据
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';
    // 检查是否有数据
    const checSystem = await this.roleRepository.exists({
      where: { name: '管理员' },
    });
    const checkNormal = await this.roleRepository.exists({
      where: { name: '普通用户' },
    });

    const checkpermission1 = await this.permissionRepository.exists({
      where: { code: 'ccc' },
    });
    const checkpermission2 = await this.permissionRepository.exists({
      where: { code: 'ddd' },
    });
    // 如果没有则创建
    if (!checSystem) {
      // 如果没有则创建
      if (!checkpermission1) {
        await this.permissionRepository.save([permission1]);
      }
      if (!checkpermission2) {
        await this.permissionRepository.save([permission2]);
      }
      const permissionC = await this.permissionRepository.findOne({
        where: { code: 'ccc' },
      });
      const permissionD = await this.permissionRepository.findOne({
        where: { code: 'ddd' },
      });
      role1.permissions = [permissionC, permissionD];
      await this.roleRepository.save([role1]);
    }
    if (!checkNormal) {
      if (!checkpermission2) {
        await this.permissionRepository.save([permission2]);
      }
      const permissionD = await this.permissionRepository.findOne({
        where: { code: 'ddd' },
      });
      role1.permissions = [permissionD];
      await this.roleRepository.save([role2]);
    }

    // 从数据库获取数据
    const systemRole = await this.roleRepository.findOne({
      where: { name: '管理员' },
    });
    const normalRole = await this.roleRepository.findOne({
      where: { name: '普通用户' },
    });

    const checkAdmin = await this.userRepository.findOne({
      where: { username: 'admin', isAdmin: true },
    });

    for (let index = 0; index < 36; index++) {
      if ([11, 33].includes(index)) {
        // 为管理员用户
        const user1 = new User();
        user1.username =
          index === 11 && !checkAdmin
            ? 'root'
            : faker.person
                .fullName()
                .toLowerCase()
                .split(' ')
                .join('')
                .slice(0, 10);
        user1.password = md5('111111');
        user1.email = faker.internet.email();
        user1.isAdmin = true;
        user1.nickName = fakerZH_CN.person.fullName();
        user1.phoneNumber = fakerZH_CN.phone.number();
        user1.headPic = faker.image.avatar();
        user1.roles = [systemRole];
        await this.userRepository.save([user1]);
      } else {
        // 冻结用户
        const user2 = new User();
        user2.username = faker.person
          .fullName()
          .toLowerCase()
          .split(' ')
          .join('')
          .slice(0, 10);
        user2.password = md5('222222');
        user2.email = faker.internet.email();
        user2.nickName = fakerZH_CN.person.fullName();
        user2.headPic = faker.image.avatar();
        user2.isFrozen = index % 8 == 0;
        user2.roles = [normalRole];
        await this.userRepository.save([user2]);
      }
    }
  }

  /** 清空权限相关数据 */
  async clearAuth() {
    this.permissionRepository.delete({});
    this.roleRepository.delete({});
    // this.userRepository.delete({});
  }
}
