import { DataSource, DeleteResult } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
  async findOneByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return this.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.find();
  }

  async findOneByApiKey(apiKey: string): Promise<User> {
    return this.findOne({ where: { apiKey } });
  }

  async saveUser(user: User): Promise<User> {
    return this.save(user);
  }

  async update2FASecret(userId: number, secret: string): Promise<void> {
    await this.update({ id: userId }, { twoFASecret: secret, enable2FA: true });
  }

  async disable2FA(userId: number): Promise<void> {
    await this.update({ id: userId }, { enable2FA: false, twoFASecret: null });
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.delete(id);
  }
}
