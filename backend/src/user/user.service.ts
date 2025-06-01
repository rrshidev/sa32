import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByTelegramId(telegramId: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { telegramId } });
  }

  async createMinimal(data: {
    telegramId: number;
    name: string;
    username?: string;
    isRegistered: boolean;
  }): Promise<User> {
    const user = this.userRepository.create({
      id: uuidv4(),
      telegramId: data.telegramId,
      name: data.name,
      username: data.username,
      isRegistered: data.isRegistered,
    });
    return this.userRepository.save(user);
  }

  async completeRegistration(
    userId: string,
    userData: Partial<User>,
  ): Promise<User> {
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['cars'],
    });
  }
}
