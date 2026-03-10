import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoController } from './geo.controller';
import { CityModule } from '../city/city.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    CityModule,
  ],
  controllers: [GeoController],
  providers: [],
  exports: [],
})
export class GeoModule {}
