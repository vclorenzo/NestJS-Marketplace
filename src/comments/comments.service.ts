import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  create(createCommentInput: CreateCommentInput) {
    const newComment = this.commentsRepository.create(createCommentInput);
    return this.commentsRepository.save(newComment);
  }

  getUser(userId: number): Promise<User> {
    return this.usersService.findOneID(userId);
  }

  getProduct(productId: number): Promise<Product> {
    return this.productsService.findOne(productId);
  }

  async findAll(
    limit: number = 10,
    page: number = 1,
  ): Promise<{
    comments: Comment[];
  }> {
    const skip = (page - 1) * limit;
    const take = limit;

    const [comments, total] = await this.commentsRepository.findAndCount({
      skip,
      take,
    });

    return {
      comments,
    };
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('No comment found');
    }
    return comment;
  }

  async update(
    id: number,
    updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    const commentToUpdate = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!commentToUpdate) {
      throw new NotFoundException('No comment found');
    }

    await this.commentsRepository.update(
      commentToUpdate.id,
      updateCommentInput,
    );

    const updatedComment = await this.commentsRepository.findOneOrFail({
      where: { id: commentToUpdate.id },
    });

    return updatedComment;
  }

  async remove(id: number): Promise<Comment | null> {
    const commentToRemove = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!commentToRemove) {
      throw new NotFoundException('no comment found');
    }

    await this.commentsRepository.remove(commentToRemove);
    return commentToRemove;
  }
}
