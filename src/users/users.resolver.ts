import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotFoundException } from '@nestjs/common';

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

  @Query(() => User, { name: 'user' })
  findOne(@Args('email', { type: () => String }) email: string) {
    return this.usersService.findOne(email);
  }

  @Mutation(() => User)
  updateUser(
    @Args('email', { type: () => String }) email: string,
    @Args('user') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(email, updateUserInput);
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
