import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from '../users/decorator/user.decorator';
import { ProductsService } from 'src/products/products.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    // private readonly productsService: ProductsService,
  ) {}

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

  @Query((returns) => User)
  @UseGuards(JwtAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    if (user.isAdmin === true) {
      throw new ForbiddenException(
        'Permission denied. Only admins can remove users.',
      );
    }
    return this.usersService.findOne(user.email);
  }

  @Query(() => User, { name: 'walletBalance' })
  @UseGuards(JwtAuthGuard)
  getWalletBalance(
    @Args('email', { type: () => String }) email: string,
    @CurrentUser() user: User,
  ) {
    if (user.email !== email) {
      throw new ForbiddenException(
        'You are not authorized to view this wallet balance',
      );
    }
    return this.usersService.getWalletBalance(email);
  }

  // @Mutation(() => User)
  // // @UseGuards(JwtAuthGuard)
  // async purchase(
  //   @Args('email', { type: () => String }) email: string,
  //   @Args('productId', { type: () => Number }) productId: number,
  // ) {
  //   //Find product
  //   const product = await this.productsService.findOne(productId);

  //   // check walletbalance
  //   const user = await this.usersService.findOne(email);

  //   // Check if product price <= walletbalance
  //   const amount = product.price;
  //   const credits = user.walletBalance;
  //   if (amount > credits) {
  //     return;
  //   }

  //   const remainingBalance = credits - amount;

  //   // update price from wallet ballance

  //   return this.usersService.purchase(email, {
  //     walletBalance: remainingBalance,
  //   });
  // }

  @Mutation(() => User)
  updateUser(
    @Args('email', { type: () => String }) email: string,
    @Args('user') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(email, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async removeUser(
    @Args('adminEmail', { type: () => String }) adminEmail: string,
    @Args('email', { type: () => String }) email: string,
    @CurrentUser() user: User,
  ): Promise<User | null> {
    const activeUser = await this.usersService.findOne(user.email);
    if (adminEmail !== activeUser.email) {
      throw new ForbiddenException('Permission denied. Invalid admin email.');
    }
    if (!activeUser.isAdmin) {
      throw new ForbiddenException(
        'Permission denied. Only admins can remove users.',
      );
    }
    const removedUser = await this.usersService.remove(email);

    if (!removedUser) {
      throw new NotFoundException('No user found');
    }

    return removedUser;
  }
}
