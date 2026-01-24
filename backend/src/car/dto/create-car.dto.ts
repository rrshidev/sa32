import { IsString, IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateCarDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsOptional()
  @IsString()
  vin?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mileage?: number;
}
