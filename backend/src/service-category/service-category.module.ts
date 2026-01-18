import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { ServiceCategoryService } from './service-category.service';
import { ServiceCategoryController } from './service-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory])],
  providers: [ServiceCategoryService],
  controllers: [ServiceCategoryController],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
