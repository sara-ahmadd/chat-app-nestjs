import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';

export abstract class AbstractDBRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<T>) {}

  async create({ data }: { data: DeepPartial<T> }) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }
}
