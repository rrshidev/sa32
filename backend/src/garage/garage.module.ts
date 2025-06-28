import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../entities/car.entity';
import { ClientProfile } from '../entities/client-profile.entity';
import { GarageService } from './garage.service';
import { GarageController } from './garage.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car, ClientProfile]), UserModule],
  providers: [GarageService],
  controllers: [GarageController],
  exports: [GarageService],
})
export class GarageModule {}
