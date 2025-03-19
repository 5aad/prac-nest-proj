import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, IUser } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from 'src/common/storage/storage.interface';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    @Inject('STORAGE_SERVICE') private readonly storageService: StorageService,
  ) {}

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, firstName, lastName, phone, address, gender, dateOfBirth } =
      createUserDto;
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const verificationToken = uuidv4();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24);

    const newUser = this.userModel.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      address,
      gender,
      dateOfBirth,
      isEmailVerified: false,
      emailVerification: {
        token: verificationToken,
        expires: verificationExpiry,
      },
      role: Role.User,
    });

    return newUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id, // Find by ObjectId
      updateUserDto, // Data to update
      { new: true, runValidators: true } // Return updated user and run validations
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { deleted: true };
  }

  async uploadUserAvatar(file: Express.Multer.File, id: string) {
    const url = await this.storageService.uploadFile(file, `avatars/${id}`);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { profileImage: url },
      { new: true }
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }
}
