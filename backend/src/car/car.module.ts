import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarService } from './car.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
