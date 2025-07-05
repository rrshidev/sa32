// import { Module, forwardRef } from '@nestjs/common';
// import { ConfigModule } from '@nestjs/config';
// import { DatabaseModule } from './database/database.module';
// import { UserModule } from './user/user.module';
// import { GarageModule } from './garage/garage.module';
// import { AppointmentModule } from './appointment/appointment.module';
// import { AuthModule } from './auth/auth.module';
// import { NotificationModule } from './notification/notification.module';
// import { ServiceModule } from './service/service.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     DatabaseModule,
//     forwardRef(() => UserModule),
//     GarageModule,
//     AppointmentModule,
//     forwardRef(() => AuthModule),
//     NotificationModule,
//     ServiceModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
// app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../.env'),
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
