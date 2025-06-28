import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  make: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mileage?: number;
}
