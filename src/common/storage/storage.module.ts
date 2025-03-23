import { Module } from '@nestjs/common';
import { FirebaseStorageService } from './firebase-storage.service';
import { DigitalOceanStorageService } from './digital-ocean-storage.service';

const useFirebase = process.env.STORAGE_PROVIDER === 'firebase';

@Module({
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
export class StorageModule {}
