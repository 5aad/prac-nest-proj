// import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
  // @ApiProperty({ example: '660d0ea0211aee5c41b2cde5' })
  @IsNotEmpty()
  receivingUser: string;

  // @ApiProperty({ example: '660d0ea0211aee5c41b2cde6' })
  @IsNotEmpty()
  givenUser: string;

  // @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  // @ApiProperty({ example: 'Great experience!' })
  @IsOptional()
  @IsString()
  comment?: string;
}
