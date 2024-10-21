import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './users/entities/users.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGODB_URL || 'mongodb://localhost:27017/nestjs',
  database: process.env.MONGODB_DB_NAME || 'nestjs',
  entities: [Users],
  synchronize: true,
  useUnifiedTopology: true,
};
