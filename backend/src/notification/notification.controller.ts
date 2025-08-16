import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    // private readonly notificationService: NotificationService, // Временно отключен
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create notification' })
  @ApiResponse({ status: 201, description: 'Notification created' })
  async create(@Body() createDto: CreateNotificationDto) {
    // return this.notificationService.createAndSend(createDto); // Временно отключен
    return { message: 'Notification service temporarily disabled' };
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'User notifications' })
  async getUserNotifications(@Param('userId') userId: string) {
    // return this.notificationService.getUserNotifications(userId); // Временно отключен
    return { message: 'Notification service temporarily disabled', userId };
  }
}
