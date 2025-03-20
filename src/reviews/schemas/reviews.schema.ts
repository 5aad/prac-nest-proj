import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema({ timestamps: true })
export class Reviews {
  @Prop({ type: ObjectId, required: true })
  receivingUser: ObjectId;

  @Prop({ type: ObjectId, required: true })
  givenUser: ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, required: false })
  comment?: string;
}

export type ReviewsDocument = Reviews & Document;
export const ReviewsSchema = SchemaFactory.createForClass(Reviews);
