import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { DelistProductInput } from './dto/delist-product.input';

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

  async searchAndPaginate(
    pageSize: number = 10,
    page: number = 1,
    minPrice: number,
    maxPrice: number,
    title: string,
    description: string,
    category: string,
  ): Promise<{
    products: Product[];
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * pageSize;
      const take = pageSize;

      const result = this.productsRepository
        .createQueryBuilder('product')
        .select(['title', 'price', 'description', 'category'])
        .where('price BETWEEN :minPrice AND :maxPrice', {
          minPrice: minPrice,
          maxPrice: maxPrice,
        })
        .andWhere('title LIKE :title', { title: `3DS` })
        .andWhere('description LIKE :description', {
          description: `TEST`,
        })
        .andWhere('category LIKE :category', { category: `gaming` });
      // .andWhere('isListed IS TRUE');

      console.log(result);

      const [products, total] = await result
        .skip(skip)
        .take(take)
        .getManyAndCount();

      const totalPages = Math.ceil(total / pageSize);
      return {
        products,
        total,
        limit: pageSize,
        offset: skip,
        page,
        totalPages,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['comments'],
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

  async delist(
    id: number,
    delistProductInput: DelistProductInput,
  ): Promise<Product> {
    const productToUpdate = await this.productsRepository.findOne({
      where: { id },
    });

    if (!productToUpdate) {
      throw new NotFoundException('No product found');
    }

    await this.productsRepository.update(
      productToUpdate.id,
      delistProductInput,
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
      throw new NotFoundException('No product found');
    }

    await this.productsRepository.remove(productToRemove);
    return productToRemove;
  }
}
