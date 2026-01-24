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
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [
    // Используем TypeOrmModule вместо UserModule для разрыва цикла
    TypeOrmModule.forFeature([User]),
    forwardRef(() => UserModule),
    CityModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '30d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule, // Важно экспортировать JwtModule для других модулей
    PassportModule,
  ],
})
export class AuthModule {}
