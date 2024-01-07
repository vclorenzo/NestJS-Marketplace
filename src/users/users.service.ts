import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { email, password } = createUserInput;

    // Check if the email is already in use
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const newUser = this.usersRepository.create({
      ...createUserInput,
      password: result,
    });
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return user;
  }

  async findOneID(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return user;
  }

  async update(email: string, updateUserInput: UpdateUserInput): Promise<User> {
    const userToUpdate = await this.usersRepository.findOne({
      where: { email },
    });

    if (!userToUpdate) {
      throw new NotFoundException('No user found');
    }

    await this.usersRepository.update(userToUpdate.id, updateUserInput);

    const updatedUser = await this.usersRepository.findOneOrFail({
      where: { id: userToUpdate.id },
    });

    return updatedUser;
  }

  async remove(email: string): Promise<User | null> {
    const userToRemove = await this.usersRepository.findOne({
      where: { email },
    });

    if (!userToRemove) {
      throw new NotFoundException('No user found');
    }

    await this.usersRepository.remove(userToRemove);
    return userToRemove;
  }
}
