// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Users } from '../users/entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Users> {
    const { email, password, first_name, last_name } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role: Role.User, // default role is 'user'
    });

    return this.userRepository.save(newUser);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<Users | null> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    console.log(user)
    if (user && (await bcrypt.compare(password, user.password))) {
      return user; // Valid user
    }
    return null; // Invalid credentials
  }

  async login(user: Users) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      data:user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
