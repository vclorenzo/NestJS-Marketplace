import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private usersService: UsersService,
    private productsService: ProductsService,
  ) {}

  create(createOrderInput: CreateOrderInput) {
    const newOrder = this.ordersRepository.create(createOrderInput);
    return this.ordersRepository.save(newOrder);
  }

  getUser(userId: number): Promise<User> {
    return this.usersService.findOneID(userId);
  }

  getProduct(productId: number): Promise<Product> {
    return this.productsService.findOne(productId);
  }

  findAll() {
    return this.ordersRepository.find();
  }

  async findOne(id: number) {
    const product = await this.ordersRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('No order found');
    }
    return product;
  }

  async update(id: number, updateOrderInput: UpdateOrderInput) {
    const orderToUpdate = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!orderToUpdate) {
      throw new NotFoundException('No order found');
    }

    await this.ordersRepository.update(orderToUpdate.id, updateOrderInput);

    const updatedProduct = await this.ordersRepository.findOneOrFail({
      where: { id: orderToUpdate.id },
    });

    return updatedProduct;
  }

  async remove(id: number) {
    const orderToRemove = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!orderToRemove) {
      throw new NotFoundException('no order found');
    }

    await this.ordersRepository.remove(orderToRemove);
    return orderToRemove;
  }
}
