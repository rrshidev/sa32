// import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from '../user/user.service';
// import * as bcrypt from 'bcrypt';
// import { User, UserRole } from '../entities/user.entity';

// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private jwtService: JwtService,
//   ) {}

//   async validateUser(email: string, pass: string): Promise<any> {
//     const user = await this.userService.findOneByEmail(email);
//     if (user && (await bcrypt.compare(pass, user.password))) {
//       const { password, ...result } = user;
//       return result;
//     }
//     return null;
//   }

//   login(user: User) {
//     const payload = {
//       email: user.email,
//       sub: user.id,
//       role: user.role,
//     };
//     return {
//       access_token: this.jwtService.sign(payload),
//     };
//   }

//   async register(userData: Partial<User>) {
//     const hashedPassword = await bcrypt.hash(userData.password, 10);
//     return this.userService.create({
//       email: userData.email!,
//       // phone: userData.phone,
//       password: hashedPassword,
//       // role: userData.role || UserRole.CLIENT // Добавляем значение по умолчанию
//     });
//   }
// }
// auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    // Простейшая проверка пароля для теста
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async login(user: any) {
    return {
      access_token: this.jwtService.sign({ email: user.email, sub: user.id }),
    };
  }
}
