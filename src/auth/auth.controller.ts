// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  HttpStatus,
  ValidationPipe,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This endpoint will redirect to Google for authentication
  }

  // Callback endpoint that Google will redirect to after authentication
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    try {
      // req.user is set by the GoogleStrategy validate() method.
      return this.authService.login(req.user);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Google authentication failed',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
