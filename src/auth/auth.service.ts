import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user-input';
import { scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { User } from 'src/users/entities/user.entity';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginUserInput: LoginUserInput): Promise<any> {
    const user = await this.usersService.findOne(loginUserInput.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('User suspended');
    }
    const { password: hashedPassword, ...result } = user;

    // Decrypt and compare passwords
    const [salt, storedHash] = hashedPassword.split('.');
    const providedHash = (await scrypt(
      loginUserInput.password,
      salt,
      32,
    )) as Buffer;

    if (storedHash !== providedHash.toString('hex')) {
      throw new NotFoundException('Invalid password');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
}
