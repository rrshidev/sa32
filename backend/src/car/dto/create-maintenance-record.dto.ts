import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateMaintenanceRecordDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
