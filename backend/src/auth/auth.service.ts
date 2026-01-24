import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private cityService: CityService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return null;

    let isMatch: boolean;
    try {
      isMatch = await bcrypt.compare(pass, user.password);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return null;
    }

    if (!isMatch) return null;

    return user;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const accessToken = await this.jwtService.sign(payload);
    return {
      access_token: accessToken,
    };
  }

  async register(userData: CreateUserDto): Promise<User> {
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    } catch (error) {
      console.error('Error hashing password:', (error as Error).message);
      throw new Error('Failed to hash password');
    }

    // Если указан город, регистрируем его
    if (userData.city) {
      try {
        await this.cityService.registerCity(userData.city, 'RU');
        console.log(`City ${userData.city} registered during user registration`);
      } catch (error) {
        console.error('Error registering city:', error);
        // Не прерываем регистрацию пользователя если город не зарегистрировался
      }
    }

    return this.userService.create({
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      role: userData.role,
      // Остальные поля инициализируем как null
      telegramId: undefined,
      clientProfile: undefined,
      serviceProfile: undefined,
    });
  }
}
