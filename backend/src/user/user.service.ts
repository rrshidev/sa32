import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ClientProfile } from '../entities/client-profile.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

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

  async create(userData: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (updateData.email) user.email = updateData.email;
    if (updateData.phone) user.phone = updateData.phone;

    if (updateData.newPassword) {
      if (!updateData.currentPassword) {
        throw new Error('Current password is required');
      }
      const isValid = await bcrypt.compare(
        updateData.currentPassword,
        user.password,
      );
      if (!isValid) throw new Error('Invalid current password');
      user.password = await bcrypt.hash(updateData.newPassword, 10);
    }

    return this.userRepository.save(user);
  }

  async getProfile(userId: string) {
    const user = await this.findOneById(userId);

    if (user.role === 'client') {
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
}
