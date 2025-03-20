import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reviews } from './schemas/reviews.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Review', schema: Reviews }])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
