import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServiceProfileService } from './service-profile.service';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('ServiceProfile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('service-profile')
export class ServiceProfileController {
  constructor(private readonly serviceProfileService: ServiceProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get service profile by user' })
  @ApiResponse({ status: 200, description: 'Service profile data' })
  async getServiceProfile(@Req() req) {
    return this.serviceProfileService.getServiceProfileByUserId(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create service profile' })
  @ApiResponse({ status: 201, description: 'Service profile created' })
  async createServiceProfile(@Req() req, @Body() createDto: CreateServiceProfileDto) {
    return this.serviceProfileService.createServiceProfile(req.user.sub, createDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update service profile' })
  @ApiResponse({ status: 200, description: 'Service profile updated' })
  async updateServiceProfile(@Req() req, @Body() updateDto: UpdateServiceProfileDto) {
    return this.serviceProfileService.updateServiceProfile(req.user.sub, updateDto);
  }
}
