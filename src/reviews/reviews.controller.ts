import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    try {
      createReviewDto.givenUser = req.user.id;
      const review = await this.reviewsService.createReview(createReviewDto);
      return { status: 'success', data: review };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to create review',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:userId')
  async getReviewsForUser(@Param('userId') userId: string) {
    try {
      const reviews = await this.reviewsService.getReviewsForUser(userId);
      return { status: 'success', data: reviews };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get reviews',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('given')
  async getReviewsByGivenUser(@Request() req) {
    try {
      const reviews = await this.reviewsService.getReviewsByGivenUser(
        req.user.id,
      );
      return { status: 'success', data: reviews };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get given reviews',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string) {
    try {
      const review = await this.reviewsService.getReviewById(id);
      return { status: 'success', data: review };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to get review',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateReview(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    try {
      const updatedReview = await this.reviewsService.updateReview(
        id,
        updateReviewDto,
      );
      return { status: 'success', data: updatedReview };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update review',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    try {
      await this.reviewsService.deleteReview(id);
      return { status: 'success', message: 'Review deleted successfully' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to delete review',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
