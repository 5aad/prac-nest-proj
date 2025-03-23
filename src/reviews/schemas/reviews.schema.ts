import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IReview extends Document {
  receivingUser: ObjectId;
  givenUser: ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    receivingUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    givenUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

const ReviewModel = model<IReview>('Review', ReviewSchema);

// Export the model
export { ReviewModel, ReviewSchema };
