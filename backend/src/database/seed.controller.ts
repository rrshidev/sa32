import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed database with test data' })
  async seedAll() {
    await this.seedService.seedAll();
    return { message: 'Database seeded successfully' };
  }
}
