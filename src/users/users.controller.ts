// src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from './entities/users.entity';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin')
  getAdminData() {
    return 'This route is for admins only!';
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile() {
    return 'This is a user profile!';
  }
}
