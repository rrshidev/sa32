import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByTelegramId(telegramId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { telegramId } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async createMinimalUser(
    telegramId: number,
    telegramData: any,
  ): Promise<User> {
    return this.userRepository.save({
      telegramId,
      name: telegramData.first_name || 'Неизвестный',
      username: telegramData.username || null,
      isRegistered: false,
    });
  }

  async completeRegistration(
    userId: number,
    userData: Partial<User>,
  ): Promise<User> {
    await this.userRepository.update(userId, {
      ...userData,
      isRegistered: true,
    });
    return this.userRepository.findOneBy({ id: userId });
  }
}
