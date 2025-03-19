import { Schema, model, Document } from 'mongoose';

// Enum for user roles
export enum Role {
  User = 'user',
  Vendor = 'vendor',
  Admin = 'admin',
}

// Interface for User Document
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  isEmailVerified: boolean;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  address?: IAddress;
  emailVerification?: IVerification;
  passwordResetVerification?: IVerification;
  googleAuth?: IGoogleAuth;
  stripeIdentity?: IStripeIdentity;
}

// Embedded Address Interface
export interface IAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

// Embedded Verification Interface
export interface IVerification {
  token?: string;
  expires?: Date;
}

// Embedded GoogleAuth Interface
export interface IGoogleAuth {
  googleId?: string;
  accessToken?: string;
}

// Embedded StripeIdentity Interface
export interface IStripeIdentity {
  stripeIdentityId?: string;
  stripeIdentityStatus?: string;
}

// Embedded Address Schema
const AddressSchema = new Schema<IAddress>({
  street: { type: String, required: false },
  city: { type: String, required: false },
  postalCode: { type: String, required: false },
  country: { type: String, required: false },
});

// Embedded Verification Schema
const VerificationSchema = new Schema<IVerification>({
  token: { type: String, required: false },
  expires: { type: Date, required: false },
});

// Embedded GoogleAuth Schema
const GoogleAuthSchema = new Schema<IGoogleAuth>({
  googleId: { type: String, required: false },
  accessToken: { type: String, required: false },
});

// Embedded StripeIdentity Schema
const StripeIdentitySchema = new Schema<IStripeIdentity>({
  stripeIdentityId: { type: String, required: false },
  stripeIdentityStatus: { type: String, required: false },
});

// User Schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.User,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  profileImage: { type: String, required: false },
  dateOfBirth: { type: Date, required: false },
  gender: { type: String, required: false },
  phone: { type: String, required: false },
  address: { type: AddressSchema, required: false },
  emailVerification: { type: VerificationSchema, required: false },
  passwordResetVerification: { type: VerificationSchema, required: false },
  googleAuth: { type: GoogleAuthSchema, required: false },
  stripeIdentity: { type: StripeIdentitySchema, required: false },
});

// Create the User model
const UserModel = model<IUser>('User', UserSchema);

// Export the model
export { UserModel };
