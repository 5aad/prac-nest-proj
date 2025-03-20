import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reviews, ReviewsDocument } from './schemas/reviews.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Reviews.name)
    private readonly reviewsModel: Model<ReviewsDocument>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto): Promise<Reviews> {
    const { receivingUser, givenUser, rating, comment } = createReviewDto;

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5.');
    }

    const newReview = new this.reviewsModel({
      receivingUser: new ObjectId(receivingUser),
      givenUser: new ObjectId(givenUser),
      rating,
      comment,
    });

    return newReview.save();
  }

  async getReviewsForUser(userId: string): Promise<Reviews[]> {
    return this.reviewsModel
      .find({ receivingUser: new ObjectId(userId) })
      .exec();
  }

  async getReviewsByGivenUser(userId: string): Promise<Reviews[]> {
    return this.reviewsModel.find({ givenUser: new ObjectId(userId) }).exec();
  }

  async getReviewById(id: string): Promise<Reviews> {
    const review = await this.reviewsModel.findById(id).exec();

    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return review;
  }

  async updateReview(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Reviews> {
    const updatedReview = await this.reviewsModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();

    if (!updatedReview) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return updatedReview;
  }

  async deleteReview(id: string): Promise<{ deleted: boolean }> {
    const result = await this.reviewsModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }

    return { deleted: true };
  }
}
