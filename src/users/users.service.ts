import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StorageService } from 'src/common/storage/storage.interface';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @Inject('STORAGE_SERVICE') private readonly storageService: StorageService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<Users> {
    const { email, firstName, lastName, phone, address, gender, dateOfBirth } =
      createUserDto;
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const verificationToken = uuidv4();
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24);

    const newUser = this.userRepository.create({
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

    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<Users[]> {
    const users = await this.userRepository.find();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findById(id: string): Promise<Users> {
    const objectId = new ObjectId(id);
    const user = await this.userRepository.findOne({ where: { id: objectId } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const objectId = new ObjectId(id);
    const user = await this.userRepository.findOne({ where: { id: objectId } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const updatedUser = Object.assign(user, updateUserDto);

    return await this.userRepository.save(updatedUser);
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { deleted: true };
  }

  async uploadUserAvatar(file: Express.Multer.File, id: string) {
    const url = await this.storageService.uploadFile(file, `avatars/${id}`);
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.profileImage = url;

    return await this.userRepository.save(user);
  }
}
