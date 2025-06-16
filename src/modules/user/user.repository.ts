import { AbstractDBRepository } from 'src/DB/db.repository';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UserRepository extends AbstractDBRepository<User> {
  constructor(
    @InjectRepository(User)
    protected readonly User: Repository<User>,
  ) {
    super(User);
  }

  async create({ data }: { data: DeepPartial<User> }) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }
}
