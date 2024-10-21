import { Entity, Column, UpdateDateColumn, ObjectIdColumn, ObjectId, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid'; 

export enum Role {
  User = 'user',
  Vendor = 'vendor',
  Admin = 'admin',
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
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
