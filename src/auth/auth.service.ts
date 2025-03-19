// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, IUser } from '../users/schemas/user.schema';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<IUser | null> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Valid user
    }
    return null; // Invalid credentials
  }

  async login(user: IUser) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      data: user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
