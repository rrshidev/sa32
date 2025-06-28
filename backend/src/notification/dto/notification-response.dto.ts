import { ApiProperty } from '@nestjs/swagger';
import {
  NotificationType,
  NotificationChannel,
} from '../../entities/notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ enum: NotificationType })
  type: NotificationType;

  @ApiProperty({ enum: NotificationChannel })
  channel: NotificationChannel;

  @ApiProperty({ example: 'Новая запись' })
  title: string;

  @ApiProperty({ example: 'Вы записаны на 15:00 завтра' })
  content: string;

  @ApiProperty({ example: false })
  isRead: boolean;

  @ApiProperty({ example: '2023-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({
    example: { appointmentId: '550e8400-e29b-41d4-a716-446655440000' },
    nullable: true,
  })
  metadata?: Record<string, any>;
}
