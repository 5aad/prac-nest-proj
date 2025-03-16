import { IsString, IsOptional } from 'class-validator';

export class Base64UploadDto {
  @IsString()
  file: string;

  @IsOptional()
  @IsString()
  originalname?: string;

  @IsOptional()
  @IsString()
  mimetype?: string;
}
