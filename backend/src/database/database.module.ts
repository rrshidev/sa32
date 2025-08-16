import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get('DB_HOST');
        const port = configService.get('DB_PORT');
        const username = configService.get('DB_USERNAME');
        const password = configService.get('DB_PASSWORD');
        const database = configService.get('DB_DATABASE');
        
        console.log('Database config:', { host, port, username, password, database });
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNC') === 'true', // Только для разработки!
          logging: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
