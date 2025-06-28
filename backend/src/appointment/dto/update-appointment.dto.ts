import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsUUID, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: 'confirmed' | 'cancelled' | 'completed';
  cancellationReason?: string;
}
