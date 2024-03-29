import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from '../users/decorator/user.decorator';
import { ProductsService } from 'src/products/products.service';
import { DeactivateUserInput } from './dto/deactivate-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
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
  @Query(() => User, { name: 'user' })
  findOne(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findOne(email);
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

  @Mutation(() => User)
  // @UseGuards(JwtAuthGuard)
  async purchase(
    @Args('email', { type: () => String }) email: string,
    @Args('productId', { type: () => Number }) productId: number,
  ) {
    //Find product
    const product = await this.productsService.findOne(productId);

    // check walletbalance
    const user = await this.usersService.findOne(email);

    const { id: prodId, price, userId: prodUserId, isListed } = product;
    const { id: userId, walletBalance } = user;

    // Check if buyer is same as owner
    if (prodUserId === userId) {
      throw new BadRequestException('Product already owned');
    }

    // Check if product is available
    if (!isListed) {
      throw new BadRequestException('Product is unavailable');
    }

    if (price > walletBalance) {
      // Check if product price <= walletbalance
      throw new BadRequestException('Insufficient balance');
    }

    const remainingBalance = walletBalance - price;

    //update userID from product
    this.productsService.update(prodId, { userId: userId });

    const seller = await this.usersService.findOneID(prodUserId);

    const profit = seller.walletBalance + price;

    //update wallet of seller
    this.usersService.purchase(seller.email, {
      walletBalance: profit,
    });

    // update price from wallet ballance and  return
    return this.usersService.purchase(email, {
      walletBalance: remainingBalance,
    });
  }

  @Mutation(() => User)
  updateUser(
    @Args('email', { type: () => String }) email: string,
    @Args('user') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(email, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async adminUpdateUserStatus(
    @Args('adminEmail') adminEmail: string,
    @Args('userEmail') userEmail: string,
    @Args('status') deactivateUserInput: DeactivateUserInput,
    @CurrentUser()
    user: User,
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
    const removedUser = await this.usersService.suspend(
      userEmail,
      deactivateUserInput,
    );

    if (!removedUser) {
      throw new NotFoundException('No user found');
    }
    return removedUser;
  }
}
