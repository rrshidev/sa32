import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceProfile } from '../entities/service-profile.entity';
import { ServiceProfileService } from './service-profile.service';
import { ServiceProfileController } from './service-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceProfile])],
  providers: [ServiceProfileService],
  controllers: [ServiceProfileController],
  exports: [ServiceProfileService],
})
export class ServiceProfileModule {}
