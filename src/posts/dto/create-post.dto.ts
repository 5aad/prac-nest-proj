// src/posts/dto/create-post.dto.ts
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsArray,
    ValidateNested,
    IsEnum,
    IsMongoId,
    ArrayMinSize,
    IsObject,
    IsDateString,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class RentDto {
    @IsNumber()
    cold: number;
  
    @IsNumber()
    warm: number;
  
    @IsNumber()
    utility: number;
  
    @IsOptional()
    @IsNumber()
    extra?: number = 0;
  
    // total will be calculated by the service so we can mark it as optional.
    @IsOptional()
    @IsNumber()
    total?: number = 0;
  }
  
  class AddressDto {
    @IsOptional()
    @IsString()
    street?: string;
  
    @IsOptional()
    @IsString()
    apartmentNo?: string;
  
    @IsOptional()
    @IsString()
    postalCode?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    country?: string;
  }
  
  class AvailabilityDto {
    @IsDateString()
    start: Date;
  
    @IsDateString()
    end: Date;
  }
  
  class LocationDto {
    @IsString()
    @IsNotEmpty()
    @IsEnum(['Point'])
    type: 'Point';
  
    @IsArray()
    @ArrayMinSize(2)
    @IsNumber({}, { each: true })
    coordinates: [number, number];
  }
  
  export class CreatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @ValidateNested()
    @Type(() => RentDto)
    rent: RentDto;
  
    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address?: AddressDto;
  
    @IsOptional()
    @IsNumber()
    size?: number;
  
    @IsOptional()
    @IsNumber()
    views?: number;
  
    @IsArray()
    @IsString({ each: true })
    images: string[];
  
    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;
  
    @IsMongoId()
    user: string; // string representation of ObjectId
  
    @IsNumber()
    maxGuests: number;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailabilityDto)
    availability: AvailabilityDto[];
  
    @IsArray()
    @IsString({ each: true })
    amenities: string[];
  }
  