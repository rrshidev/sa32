import { ApiProperty } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Замена масла' })
  name: string;

  @ApiProperty({
    example: 'Полная замена моторного масла и фильтра',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 2500 })
  price: number;

  @ApiProperty({ example: 60 })
  durationMinutes: number;

  @ApiProperty({ example: 'Техническое обслуживание' })
  category: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  serviceProfileId: string;
}
