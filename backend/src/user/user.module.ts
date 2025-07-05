import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ClientProfile } from '../entities/client-profile.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt'; // Импортируем JwtModule напрямую
import { PassportModule } from '@nestjs/passport'; // Импортируем PassportModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ClientProfile, ServiceProfile]),
    PassportModule, // Регистрируем PassportModule
    JwtModule, // Используем JwtModule вместо AuthModule
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule], // Экспортируем TypeOrmModule для AuthModule
})
export class UserModule {}

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
// import { UserService } from './user.service';

// @Module({
//   imports: [TypeOrmModule.forFeature([User])],
//   providers: [UserService],
//   exports: [UserService], // Важно экспортировать сервис!
// })
// export class UserModule {}
