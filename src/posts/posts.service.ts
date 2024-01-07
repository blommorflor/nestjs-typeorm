import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly userService: UsersService,
  ) {}

  async create({ title, content, userId }: CreatePostDto) {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new BadRequestException('This user doest not exits');
    }

    const post = this.postRepository.create({ title, content, user });

    return await this.postRepository.save(post);
  }

  async findAll() {
    return await this.postRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    return await this.postRepository.findOneBy({ id });
  }

  async update(id: number, { title, content }: UpdatePostDto) {
    return await this.postRepository.update(id, { title, content });
  }

  async remove(id: number) {
    return await this.postRepository.softDelete(id);
  }

  /**
   * This function is used to liked a post
   * @param id
   */
  async likePost(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    return await this.postRepository.update(id, { likes: post.likes + 1 });
  }
}
