import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Role } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Extract needed profile data.
    const { name, email } = profile;
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.register({
        email,
        firstName: name.givenName,
        lastName: name.familyName,
        password: uuidv4(),
        role: Role.User,
        isEmailVerified: false,
      });
    }

    // Here you can either:
    // - Create a new user in your database if it doesn't exist.
    // - Retrieve the user from your database if it exists.
    // For now, we simply pass the user object along.
    done(null, user);
  }
}
