// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '../users/schemas/user.schema';
import { RolesGuard } from '../common/guards/roles.guard';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'test',
      signOptions: { expiresIn: '1h' }, // token expiration
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserModel }]),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
