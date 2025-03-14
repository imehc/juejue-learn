import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseService<T extends BaseEntity> {
  abstract getModel(): Repository<T>;

  async create(entity: T) {
    return await this.getModel().save(entity);
  }

  async edit(entity: T): Promise<T | void> {
    return await this.getModel().save(entity);
  }

  async remove(entity: T) {
    await this.getModel().remove(entity);
  }

  async getById(id: string): Promise<T | null> {
    return await this.getModel()
      .createQueryBuilder('model')
      .where('model.id = :id', { id })
      .getOne();
  }

  async page(page: number, pageSize: number, where?: FindOptionsWhere<T>) {
    const order = { create_time: 'desc' } as FindOptionsOrder<T>;

    const [data, total] = await this.getModel().findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });

    return { data, total };
  }

  async list(where?: FindOptionsWhere<T>) {
    const order = { create_time: 'desc' } as FindOptionsOrder<T>;
    const data = await this.getModel().find({
      where,
      order,
    });

    return data;
  }
}
