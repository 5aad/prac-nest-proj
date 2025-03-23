import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { StorageModule } from 'src/common/storage/storage.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UserCacheInterceptor } from 'src/common/interceptors/user-cache.interceptor';

@Module({
  imports: [
    CacheModule.register(),
    StorageModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserCacheInterceptor],
  exports: [UsersService],
})
export class UsersModule {}
