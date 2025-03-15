import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { typeOrmConfig } from './typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FirebaseStorageService } from './common/storage/firebase-storage.service';
import { DigitalOceanStorageService } from './common/storage/digital-ocean-storage.service';
import * as dotenv from 'dotenv';

dotenv.config();
const useFirebase = process.env.STORAGE_PROVIDER === 'firebase';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ConfigModule,
    UsersModule,
  ],
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useClass: useFirebase ? FirebaseStorageService : DigitalOceanStorageService,
    },
  ],
  exports: ['STORAGE_SERVICE'],
})
export class AppModule {}