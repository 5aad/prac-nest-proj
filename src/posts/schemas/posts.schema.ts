// src/posts/schemas/post.schema.ts
import { Schema, Document, ObjectId, model } from 'mongoose';

export interface IPost extends Document {
  title: string;
  description: string;
  rent: {
    cold: number;
    warm: number;
    utility: number;
    extra: number;
    total: number;
  };
  address: {
    street?: string;
    apartmentNo?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  size?: number;
  views?: number;
  images: string[];
  location: { type: 'Point'; coordinates: [number, number] };
  user: ObjectId; // ObjectId of the user
  maxGuests: number;
  availability: { start: Date; end: Date }[];
  amenities: string[];
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    rent: {
      cold: { type: Number, required: true },
      warm: { type: Number, required: true },
      utility: { type: Number, required: true },
      extra: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    address: {
      street: { type: String },
      apartmentNo: { type: String },
      postalCode: { type: String },
      city: { type: String },
      country: { type: String },
    },
    size: { type: Number },
    views: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maxGuests: { type: Number, required: true },
    availability: [{ start: Date, end: Date }],
    amenities: { type: [String], default: [] },
  },
  { timestamps: true },
);

// Create 2dsphere index on the location field
PostSchema.index({ location: '2dsphere' });

export const PostModel = model<IPost>('Post', PostSchema);
