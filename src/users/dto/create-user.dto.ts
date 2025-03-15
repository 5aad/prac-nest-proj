import { 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    MinLength, 
    IsOptional, 
    IsDateString, 
    ValidateNested, 
    IsBoolean
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class AddressDto {
    @IsOptional()
    @IsString()
    street?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    postalCode?: string;
  
    @IsOptional()
    @IsString()
    country?: string;
  }
  
  export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(8)
    password: string;
  
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @IsNotEmpty()
    @IsString()
    lastName: string;
  
    @IsNotEmpty()
    @IsString()
    role: string;
  
    // Optional profile details
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;
  
    @IsOptional()
    @IsString()
    gender?: string;
  
    @IsOptional()
    @IsString()
    phone?: string;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;

    @IsNotEmpty()
    @IsBoolean()
    isEmailVerified: boolean;
  }
  