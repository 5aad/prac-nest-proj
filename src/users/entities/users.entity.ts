import {
  Entity,
  Column,
  UpdateDateColumn,
  ObjectIdColumn,
  ObjectId,
  CreateDateColumn,
} from 'typeorm';

export enum Role {
  User = 'user',
  Vendor = 'vendor',
  Admin = 'admin',
}

// Embedded Address object
export class Address {
  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  country?: string;
}

export class Verification {
  @Column({ nullable: true })
  token?: string;
  @Column({ nullable: true, type: 'timestamptz' })
  expires?: Date;
}

export class GoogleAuth {
  @Column({ nullable: true })
  googleId?: string;
  @Column({ nullable: true })
  accessToken?: string;
}

export class StripeIdentity {
  @Column({ nullable: true })
  stripeIdentityId?: string;
  @Column({ nullable: true })
  stripeIdentityStatus?: string;
}

@Entity()
export class Users {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ default: false })
  isEmailVerified: boolean;

  // Optional profile details
  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column((type) => Address)
  address?: Address;

  @Column((type) => Verification)
  emailVerification?: Verification;

  @Column((type) => Verification)
  passwordResetVerification?: Verification;

  @Column((type) => GoogleAuth)
  googleAuth?: GoogleAuth;

  @Column((type) => StripeIdentity)
  stripeIdentity?: StripeIdentity;
}
