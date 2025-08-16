import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, ServiceCategory]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService, TypeOrmModule],
})
export class ServiceModule {}
