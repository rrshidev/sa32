import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceCategory, ServiceProfile]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService, TypeOrmModule],
})
export class ServiceModule {}
