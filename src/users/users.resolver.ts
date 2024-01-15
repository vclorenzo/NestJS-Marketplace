import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateWalletInput } from './dto/update-wallet.input';
import { DeactivateUserInput } from './dto/deactivate-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'walletBalance' })
  @UseGuards(JwtAuthGuard)
  getWalletBalance(
    @Args('email', { type: () => String }) email: string,
    @Context() context: any,
  ) {
    if (context.email !== email) {
      throw new NotFoundException(
        'You are not authorized to view this wallet balance',
      );
    }
    return this.usersService.getWalletBalance(email);
  }

  @Mutation(() => User)
  // @UseGuards(JwtAuthGuard)
  purchase(
    @Args('email', { type: () => String }) email: string,
    @Args('productId', { type: () => Number }) productId: number,
  ) {
    return this.usersService.purchase(email, productId);
  }

  // @Mutation(() => User)
  // topUp(
  //   @Args('email', { type: () => String }) email: string,
  //   @Args('amount', { type: () => Number }) amount: number,
  // ) {
  //   return this.usersService.topUp(email, amount);
  // }

  // @Query(() => User, { name: 'user' })
  // findOne(@Args('email', { type: () => String }) email: string) {
  //   return this.usersService.findOne(email);
  // }

  @Mutation(() => User)
  updateUser(
    @Args('email', { type: () => String }) email: string,
    @Args('user') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(email, updateUserInput);
  }

  @Mutation(() => User)
  // @UseGuards(JwtAuthGuard)
  deactivate(
    @Args('email', { type: () => String }) email: string,
    @Args('status') deactivateUserInput: DeactivateUserInput,
  ) {
    return this.usersService.deactivate(email, deactivateUserInput);
  }

  @Mutation(() => User)
  async removeUser(
    @Args('email', { type: () => String }) email: string,
  ): Promise<User | null> {
    const removedUser = await this.usersService.remove(email);

    if (!removedUser) {
      throw new NotFoundException('No user found');
    }

    return removedUser;
  }
}
