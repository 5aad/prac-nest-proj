import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { FirebaseStorageService } from './common/storage/firebase-storage.service';
import { DigitalOceanStorageService } from './common/storage/digital-ocean-storage.service';
import { PostsModule } from './posts/posts.module';
import * as dotenv from 'dotenv';
import { ReviewsModule } from './reviews/reviews.module';

dotenv.config();
const useFirebase = process.env.STORAGE_PROVIDER === 'firebase';
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv('redis://localhost:6379'),
          ],
        };
      },
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017/nestjs',
      {
        dbName: process.env.MONGODB_DB_NAME || 'nestjs',
      },
    ),
    AuthModule,
    ConfigModule,
    UsersModule,
    PostsModule,
    ReviewsModule
  ],
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useClass: useFirebase
        ? FirebaseStorageService
        : DigitalOceanStorageService,
    },
  ],
  exports: ['STORAGE_SERVICE'],
})
export class AppModule {}
