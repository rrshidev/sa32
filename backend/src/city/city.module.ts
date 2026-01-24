import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { City } from '../entities/city.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import { ClientProfile } from '../entities/client-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, ServiceProfile, ClientProfile])
  ],
  providers: [CityService],
  controllers: [CityController],
  exports: [CityService],
})
export class CityModule {}
