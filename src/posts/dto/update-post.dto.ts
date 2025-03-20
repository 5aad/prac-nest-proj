// src/posts/dto/update-post.dto.ts
import {
    IsString,
    IsOptional,
    IsNumber,
    IsArray,
    ValidateNested,
    IsEnum,
    IsMongoId,
    ArrayMinSize,
    IsDateString,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  class RentDto {
    @IsOptional()
    @IsNumber()
    cold?: number;
  
    @IsOptional()
    @IsNumber()
    warm?: number;
  
    @IsOptional()
    @IsNumber()
    utility?: number;
  
    @IsOptional()
    @IsNumber()
    extra?: number;
  
    @IsOptional()
    @IsNumber()
    total?: number;
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
    @IsOptional()
    @IsDateString()
    start?: Date;
  
    @IsOptional()
    @IsDateString()
    end?: Date;
  }
  
  class LocationDto {
    @IsOptional()
    @IsString()
    @IsEnum(['Point'])
    type?: 'Point';
  
    @IsOptional()
    @IsArray()
    @ArrayMinSize(2)
    @IsNumber({}, { each: true })
    coordinates?: [number, number];
  }
  
  export class UpdatePostDto {
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => RentDto)
    rent?: RentDto;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;
  
    @IsOptional()
    @IsNumber()
    size?: number;
  
    @IsOptional()
    @IsNumber()
    views?: number;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
  
    @IsOptional()
    @ValidateNested()
    @Type(() => LocationDto)
    location?: LocationDto;
  
    @IsOptional()
    @IsMongoId()
    user?: string;
  
    @IsOptional()
    @IsNumber()
    maxGuests?: number;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AvailabilityDto)
    availability?: AvailabilityDto[];
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    amenities?: string[];
  }
  