// src/common/storage/firebase-storage.service.ts
import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseStorageService implements StorageService {
  constructor() {
    // Initialize Firebase Admin with credentials
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const bucket = getStorage().bucket();
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: { contentType: file.mimetype },
    });

    // Make file public or get a signed URL, depending on your use case
    await fileUpload.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Extract the file name from the URL
    const bucket = getStorage().bucket();
    const fileName = fileUrl.split(`${bucket.name}/`)[1];
    await bucket.file(fileName).delete();
  }
}
