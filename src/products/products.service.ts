import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from 'src/comments/comments.service';
import { Comment } from 'src/comments/entities/comment.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    private usersService: UsersService,
    // private commentsService: CommentsService,
  ) {}

  create(createProductInput: CreateProductInput) {
    const newProduct = this.productsRepository.create(createProductInput);
    return this.productsRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('No product found');
    }
    return product;
  }

  async getUser(id: number): Promise<User> {
    const user = await this.usersService.findOneID(id);
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return user;
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const productToUpdate = await this.productsRepository.findOne({
      where: { id },
    });

    if (!productToUpdate) {
      throw new NotFoundException('No product found');
    }

    await this.productsRepository.update(
      productToUpdate.id,
      updateProductInput,
    );

    const updatedProduct = await this.productsRepository.findOneOrFail({
      where: { id: productToUpdate.id },
    });

    return updatedProduct;
  }

  async remove(id: number): Promise<Product | null> {
    const productToRemove = await this.productsRepository.findOne({
      where: { id },
    });

    if (!productToRemove) {
      throw new NotFoundException('no product found');
    }

    await this.productsRepository.remove(productToRemove);
    return productToRemove;
  }
}
