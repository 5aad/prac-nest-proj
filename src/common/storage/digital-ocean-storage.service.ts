// src/common/storage/digital-ocean-storage.service.ts
import { Injectable } from '@nestjs/common';
import { StorageService } from './storage.interface';
import * as AWS from 'aws-sdk';

@Injectable()
export class DigitalOceanStorageService implements StorageService {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: process.env.DO_SPACES_ENDPOINT, // e.g. "https://nyc3.digitaloceanspaces.com"
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    await this.s3
      .putObject({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read', // or private, depending on your requirements
        ContentType: file.mimetype,
      })
      .promise();

    return `${process.env.DO_SPACES_CDN_URL}/${fileName}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    // Extract the file name from the URL
    const fileName = fileUrl.split(`${process.env.DO_SPACES_CDN_URL}/`)[1];
    await this.s3
      .deleteObject({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
      })
      .promise();
  }
}
