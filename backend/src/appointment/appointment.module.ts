import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Car } from '../entities/car.entity';
import { Service } from '../entities/service.entity';
import { Master } from '../entities/master.entity';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { UserModule } from '../user/user.module';
import { GarageModule } from '../garage/garage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Car, Service, Master]),
    UserModule,
    GarageModule,
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
