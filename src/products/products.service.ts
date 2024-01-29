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
import { SearchProductInput } from './dto/search-product.input';

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

  async search(
    searchInput: SearchProductInput,
    limit: number = 10,
    page: number = 1,
  ): Promise<Product[]> {
    const { minPrice, maxPrice, title, description, category } = searchInput;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.price',
        'product.title',
        'product.image',
        'product.description',
        'product.category',
        'product.isListed',
        'product.userId',
      ])
      .addSelect(['comment.id', 'comment.comment', 'comment.userId'])
      .leftJoinAndSelect('product.comments', 'comment')
      .where('product.isListed IS TRUE')
      .andWhere('price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .andWhere('title LIKE :title', { title: `%${title}%` })
      .andWhere('description LIKE :description', {
        description: `%${description}%`,
      })
      .andWhere('category LIKE :category', {
        category: `%${category}%`,
      })
      .orderBy('product.id', 'ASC');

    console.log(queryBuilder.getSql());

    const total = await queryBuilder.getCount();
    const totalPages = Math.ceil(total / limit);
    const pageOffset = (total / totalPages) * (page - 1);

    const products = await queryBuilder.skip(pageOffset).take(limit).getMany();

    return products;
  }

  async findAll(searchInput: SearchProductInput): Promise<Product[]> {
    const { minPrice, maxPrice, title, description, category } = searchInput;

    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .select('*')
      .where('product.isListed IS TRUE')
      .andWhere('price BETWEEN :minPrice AND :maxPrice', {
        minPrice,
        maxPrice,
      })
      .andWhere('title LIKE :title', { title: `%${title}%` })
      .andWhere('description LIKE :description', {
        description: `%${description}%`,
      })
      .andWhere('category LIKE :category', {
        category: `%${category}%`,
      });

    return await queryBuilder.getRawMany();
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
    if (!user || !user.isActive) {
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
