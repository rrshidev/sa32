// app.module.ts
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { AppointmentModule } from './appointment/appointment.module';
import { GarageModule } from './garage/garage.module';
import { ServiceModule } from './service/service.module';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        path.resolve(
          __dirname,
          `../.env.${process.env.NODE_ENV ?? 'development'}`,
        ),
        path.resolve(__dirname, '../.env'),
      ],
      isGlobal: true,
      load: [
        () => {
          console.log('Loading environment variables...');
          console.log('NODE_ENV:', process.env.NODE_ENV);
          console.log('DB_HOST:', process.env.DB_HOST);
          console.log('DB_PORT:', process.env.DB_PORT);
          console.log('DB_USERNAME:', process.env.DB_USERNAME);
          console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
          console.log('DB_DATABASE:', process.env.DB_DATABASE);
          return {};
        },
      ],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    AppointmentModule,
    GarageModule,
    ServiceModule,
    CityModule,
  ],
})
export class AppModule {}
