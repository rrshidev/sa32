import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { ClientProfile } from '../entities/client-profile.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>,
    @InjectRepository(ServiceProfile)
    private serviceProfileRepository: Repository<ServiceProfile>,
  ) {}

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['clientProfile', 'serviceProfile'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Проверка существующего пользователя
    const existingUser = await this.userRepository.findOne({ 
      where: { email: userData.email }
    });
    
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  
    // Создаем экземпляр пользователя
    const user = this.userRepository.create(userData);
    
    // Сохраняем в БД
    return await this.userRepository.save(user);
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (updateData.email) user.email = updateData.email;
    if (updateData.phone) user.phone = updateData.phone;

    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new Error('Current password is required');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const isValid = await bcrypt.compare(
        updateData.currentPassword,
        user.password,
      );
      if (!isValid) throw new Error('Invalid current password');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      user.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    return this.userRepository.save(user);
  }

  async getProfile(userId: string) {
    const user = await this.findOneById(userId);

    if (user.role === UserRole.CLIENT) {
      return {
        ...user,
        profile: user.clientProfile,
      };
    } else {
      return {
        ...user,
        profile: user.serviceProfile,
      };
    }
  }

  async findByTelegramId(telegramId: number) {
    return this.userRepository.findOne({
      where: { telegramId: telegramId.toString() },
    });
  }

  async createTelegramUser(userData: { id: number }) {
    const user = this.userRepository.create({
      telegramId: userData.id.toString(),
      // другие поля по умолчанию
    });
    return this.userRepository.save(user);
  }
}
