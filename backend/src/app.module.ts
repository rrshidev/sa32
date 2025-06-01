import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotModule } from './bot/bot.module';
import { UserModule } from './user/user.module';
import { CarModule } from './car/car.module';
import { CalendarModule } from './calendar/calendar.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    BotModule,
    UserModule,
    CarModule,
    CalendarModule,
    BullModule.forRoot({
      redis: {
        host: ConfigService.get<string>('REDIS_HOST'),
        port: ConfigService.get<string>('REDIS_PORT'),
      },
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
})
export class AppModule {}
