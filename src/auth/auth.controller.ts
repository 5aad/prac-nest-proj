// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  ValidationPipe,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    try {
      const regUser = await this.authService.register(createUserDto);
      return regUser;
      
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.errmsg,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    try {
      const user = await this.authService.validateUser(loginUserDto);
      const test = this.authService.login(user)
      return test;
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: error.errmsg,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
