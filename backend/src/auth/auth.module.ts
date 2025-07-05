// import { Module, forwardRef } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from '../entities/user.entity';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { LocalStrategy } from './strategies/local.strategy';
// import { JwtStrategy } from './strategies/jwt.strategy';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     // Используем TypeOrmModule вместо UserModule для разрыва цикла
//     TypeOrmModule.forFeature([User]),
//     PassportModule,
//     JwtModule.registerAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         secret: configService.get('JWT_SECRET'),
//         signOptions: {
//           expiresIn: configService.get('JWT_EXPIRES_IN') || '30d',
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
//   controllers: [AuthController],
//   exports: [
//     AuthService,
//     JwtModule, // Важно экспортировать JwtModule для других модулей
//     PassportModule,
//   ],
// })
// export class AuthModule {}
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule, // Просто импортируем UserModule
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'TEMPORARY_SECRET_KEY',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Экспортируем только сервис
})
export class AuthModule {}
