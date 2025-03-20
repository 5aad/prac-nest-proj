import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostModel } from './schemas/posts.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostModel }])],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
