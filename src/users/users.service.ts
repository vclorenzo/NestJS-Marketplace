import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { DeactivateUserInput } from './dto/deactivate-user.input';
// import { UpdateWalletInput } from './dto/update-wallet.input';
// import { Product } from 'src/products/entities/product.entity';
// import { Order } from 'src/orders/entities/order.entity';
// import { ProductsService } from 'src/products/products.service';

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

    // Check if the password is provided in the update input
    if (updateUserInput.password) {
      const salt = randomBytes(8).toString('hex');
      const hash = (await scrypt(updateUserInput.password, salt, 32)) as Buffer;
      const result = salt + '.' + hash.toString('hex');
      updateUserInput.password = result; // Update the password in updateUserInput
    }

    await this.usersRepository.update(userToUpdate.id, updateUserInput);

    const updatedUser = await this.usersRepository.findOneOrFail({
      where: { id: userToUpdate.id },
    });

    return updatedUser;
  }

  async deactivate(
    email: string,
    deactivateUserInput: DeactivateUserInput,
  ): Promise<User> {
    const userToDeactivate = await this.usersRepository.findOne({
      where: { email },
    });

    if (!userToDeactivate) {
      throw new NotFoundException('No user found');
    }

    if (!userToDeactivate.isActive) {
      throw new NotFoundException('User already deactivated');
    }

    await this.usersRepository.update(userToDeactivate.id, deactivateUserInput);

    const deactivatedUser = await this.usersRepository.findOneOrFail({
      where: { id: userToDeactivate.id },
    });

    return deactivatedUser;
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

  async getWalletBalance(
    email: string,
  ): Promise<{ walletBalance: number } | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('No user found');
    }
    return { walletBalance: user.walletBalance || 0 };
  }

  // async topUp(email: string, additionalCredits: number): Promise<any | null> {
  //   const userWalletToUpdate = await this.usersRepository.findOne({
  //     where: { email },
  //   });

  //   if (additionalCredits < 0) {
  //     throw new BadRequestException('Invalid Amount');
  //   }

  //   const totalCredits = userWalletToUpdate.walletBalance + additionalCredits;

  //   await this.usersRepository.update(userWalletToUpdate.id, {
  //     walletBalance: totalCredits,
  //   });

  //   const updatedWallet = await this.usersRepository.findOneOrFail({
  //     where: { id: userWalletToUpdate.id },
  //   });

  //   return updatedWallet;
  // }

  async purchase(
    email: string,
    id: number,
  ): Promise<{ walletBalance: number } | null> {
    const userWalletToUpdate = await this.usersRepository.findOne({
      where: { email },
    });

    if (!userWalletToUpdate) {
      throw new NotFoundException('No user found');
    }

    // const product = await this.productsService.findOne(id);
    // if (!product) {
    //   throw new NotFoundException('No product found');
    // }

    // const remainingBalance = userWalletToUpdate.walletBalance - product.price;
    const remainingBalance = userWalletToUpdate.walletBalance - 500;

    if (remainingBalance < 0) {
      throw new BadRequestException('Insufficient Credits');
    }

    await this.usersRepository.update(userWalletToUpdate.id, {
      walletBalance: remainingBalance,
    });

    const updatedWallet = await this.usersRepository.findOneOrFail({
      where: { id: userWalletToUpdate.id },
    });

    return updatedWallet;
  }
}
