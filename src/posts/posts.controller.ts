import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/users/schemas/user.schema';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Vendor)
  @Post('post')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createPost(@Body() createPostDto: CreatePostDto) {
    try {
      const regUser = await this.postService.create(createPostDto);
      return {
        status: 'success',
        data: regUser,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.errmsg || 'Registration failed.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('posts')
  async getPosts() {
    try {
      const posts = await this.postService.getPosts();
      return { status: 'success', data: posts };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.errmsg || 'Failed to fetch posts.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Vendor)
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUser(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    try {
      const updatedPost = await this.postService.updatePost(id, updatePostDto);
      return { status: 'success', data: updatedPost };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error updating user.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Vendor)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.postService.deletePost(id);
      return { status: 'success', message: 'Post deleted successfully.' };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message || 'Error deleting post.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
