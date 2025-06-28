import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsUUID()
  carId: string;

  @ApiProperty()
  @IsUUID()
  serviceId: string;

  @ApiProperty()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  masterId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  notes?: string;
}
