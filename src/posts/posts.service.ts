import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPost } from './schemas/posts.schema';
@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private postModel: Model<IPost>) {}

  async create(createPostDto: any): Promise<IPost> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async getPosts(): Promise<IPost[]> {
    return this.postModel.find().exec();
  }

  async getPostById(id: string): Promise<IPost> {
    return this.postModel.findById(id).exec();
  }

  async updatePost(id: string, updatePostDto: any): Promise<IPost> {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { new: true });
  }

  async deletePost(id: string): Promise<IPost> {
    return this.postModel.findByIdAndDelete(id);
  }
}
