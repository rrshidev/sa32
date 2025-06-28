import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class SlotDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  end: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  masterId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  masterName?: string;
}
