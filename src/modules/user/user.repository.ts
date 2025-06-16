import { AbstractDBRepository } from 'src/DB/db.repository';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

export class UserRepository extends AbstractDBRepository<User> {
  constructor(
    @InjectRepository(User)
    protected readonly User: Repository<User>,
  ) {
    super(User);
  }

  async create({ data }: { data: Partial<User> }) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async getUserById(id: number) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.save(user);
  }
  async getUserByEmail(email: string) {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.save(user);
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.repository.preload({
      id,
      ...updateData,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.save(user);
  }
}
