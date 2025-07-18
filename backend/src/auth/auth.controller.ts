import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { parseTelegramData, validateTelegramData } from './telegram.utils';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.login(createUserDto);
  }

  @Post('telegram')
  async telegramLogin(@Body() body: { telegramData: string }) {
    const isValid = validateTelegramData(body.telegramData);
    if (!isValid) throw new UnauthorizedException();

    const userData = parseTelegramData(body.telegramData);
    let user = await this.userService.findByTelegramId(userData.id);

    if (!user) {
      user = await this.userService.createTelegramUser(userData);
    }

    return this.authService.login(user);
  }
  // @Post('telegram')
  // async telegramAuth(@Body() data: { initData: string }) {
  //   return this.authService.authenticateTelegram(data.initData);
  // }
}
