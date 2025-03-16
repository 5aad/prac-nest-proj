// src/users/users.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Delete,
  Put,
  Param,
  HttpException,
  HttpStatus,
  Body,
  ValidationPipe,
  UsePipes,
  Request,
} from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Base64UploadDto } from './dto/base64-upload.dto';
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const regUser = await this.userService.register(createUserDto);
      return {
        status: 'success',
        data: regUser,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.errmsg || 'Registration failed.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    try {
      const user = await this.userService.findById(req.user.id);
      return { status: 'success', data: user };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error retrieving profile data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.update(
        req.user.id,
        updateUserDto,
      );
      return { status: 'success', data: updatedUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error updating profile data',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('avatar')
  async uploadAvatarBase64(
    @Request() req,
    @Body() base64UploadDto: Base64UploadDto,
  ) {
    try {
      // Decode base64 to Buffer
      const fileBuffer = Buffer.from(base64UploadDto.file, 'base64');
      const file = {
        buffer: fileBuffer,
        originalname:
          base64UploadDto.originalname || `upload-${Date.now()}.png`,
        mimetype: base64UploadDto.mimetype || 'image/png',
      } as Express.Multer.File; // Cast to Express.Multer.File type

      const avatarUrl = await this.userService.uploadUserAvatar(file, req.user.id);
      return { avatarUrl };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Admin routes

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getAllUsers() {
    try {
      const users = await this.userService.findAll();
      return { status: 'success', data: users };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error retrieving users',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return { status: 'success', data: user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.userService.update(id, updateUserDto);
      return { status: 'success', data: updatedUser };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error updating user.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.delete(id);
      // if (!result) {
      //   throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      // }
      return { status: 'success', message: 'User deleted successfully.' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error deleting user.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
