import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from '../entities/city.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { Service } from '../entities/service.entity';
import { User } from '../entities/user.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [TypeOrmModule.forFeature([City, ServiceCategory, Service, User, ServiceProfile])],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
