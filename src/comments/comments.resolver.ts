import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { NotFoundError } from 'rxjs';
import {
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorator/user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentsService.create(createCommentInput);
  }

  @Query(() => [Comment])
  async getComments(@Args('page') page: number, @Args('limit') limit: number) {
    try {
      const result = await this.commentsService.findAll(limit, page);

      if (!result.comments || result.comments.length === 0) {
        throw new NotFoundException('No comments found');
      }

      return result.comments;
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.findOne(id);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Args('id') id: number,
    @Args('comment') updateCommentInput: UpdateCommentInput,
    @Args('email') email: string,
    @CurrentUser() user: User,
  ) {
    if (user.email !== email) {
      throw new BadRequestException(
        'You are unauthorized to update this comment',
      );
    }
    return this.commentsService.update(id, updateCommentInput);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  removeComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('email') email: string,
    @CurrentUser() user: User,
  ) {
    if (user.email !== email) {
      throw new BadRequestException(
        'You are unauthorized to update this comment',
      );
    }
    return this.commentsService.remove(id);
  }

  @ResolveField((returns) => Product)
  product(@Parent() comment: Comment): Promise<Product> {
    return this.commentsService.getProduct(comment.productId);
  }

  @ResolveField((returns) => User)
  user(@Parent() comment: Comment): Promise<User> {
    return this.commentsService.getUser(comment.userId);
  }
}
