import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    // constructor(
    //     @InjectRepository(Users)
    //     private userRepository: Repository<Users>,
    //   ) {}
    
    //   findAll(): Promise<User[]> {
    //     return this.userRepository.find();
    //   }
    
    //   findOne(id: string): Promise<User> {
    //     return this.userRepository.findOneBy({ id });
    //   }
    
    
    //   async update(id: string, user: Partial<User>): Promise<User> {
    //     await this.userRepository.update(id, user);
    //     return this.userRepository.findOneBy({ id: new ObjectId(id) });
    //   }
    
    //   async delete(id: string): Promise<void> {
    //     await this.userRepository.delete(id);
    //   }
}
