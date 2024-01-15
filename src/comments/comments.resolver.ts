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
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.commentsService.create(createCommentInput);
  }

  @Query(() => [Comment], { name: 'comments' })
  async getComments(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
  ) {
    try {
      const result = await this.commentsService.findAll(pageSize, page);

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
  updateComment(
    @Args('id') id: number,
    @Args('comment') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentsService.update(id, updateCommentInput);
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }) id: number) {
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
