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
import { User } from 'src/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() createUserDto: CreateUserDto) {
    // Регистрируем пользователя
    const user = await this.authService.register(createUserDto);
    // Логиним пользователя и возвращаем токен
    const { access_token } = await this.authService.login(user);
    return { access_token };
  }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Request() req: Request & { user: User }) {
    const user: User = req.user;
    return this.authService.login(user);
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
