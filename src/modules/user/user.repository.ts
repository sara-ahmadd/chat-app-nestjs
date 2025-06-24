import { AbstractDBRepository } from 'src/DB/db.repository';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
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
  async getAllUsers() {
    const users = await this.repository.find();
    return users;
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

    return user;
  }

  /**
   * Search fro a user by his _id
   * @param _id
   * @returns User entity
   */
  async getUserBy_Id(
    _id: string,
    relations?: FindOptionsRelations<User> | undefined,
  ) {
    const user = await this.repository.findOne({ where: { _id }, relations });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  async getUserByEmail(email: string, select?: FindOptionsSelect<User>) {
    const user = await this.repository.findOne({ where: { email }, select });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.repository.findOne({ where: { _id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    //add updated data to user entity in DB
    Object.assign(user, updateData);

    await this.repository.save(user);
    return user;
  }

  async save(user: User) {
    return await this.repository.save(user);
  }
}
