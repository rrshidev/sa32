import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateServiceProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  cityId: string;
}
