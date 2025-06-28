import { ApiProperty } from '@nestjs/swagger';

export class CarResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Toyota' })
  make: string;

  @ApiProperty({ example: 'Camry' })
  model: string;

  @ApiProperty({ example: 2020 })
  year: number;

  @ApiProperty({ example: 'JT2BF22K2W0123456', required: false })
  vin?: string;

  @ApiProperty({ example: 35000, required: false })
  mileage?: number;

  @ApiProperty({ example: '2023-01-15T10:00:00.000Z' })
  createdAt: Date;
}
