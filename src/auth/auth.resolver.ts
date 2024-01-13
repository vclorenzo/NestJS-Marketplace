import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CreateUserInput } from '../users/dto/create-user.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginResponse } from './dto/login-response'; // Import the LoginResponse DTO
import { LoginUserInput } from './dto/login-user-input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation((returns) => LoginResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    const user = await this.authService.login(loginUserInput);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
