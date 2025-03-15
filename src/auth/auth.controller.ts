// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.validateUser(loginUserDto);
      return this.authService.login(user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.errmsg,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
