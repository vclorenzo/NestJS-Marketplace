import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { DelistProductInput } from './dto/delist-product.input';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => Product)
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ) {
    return this.productsService.create(createProductInput);
  }

  @ResolveField((returns) => User)
  user(@Parent() product: Product): Promise<User> {
    return this.productsService.getUser(product.userId);
  }

  @Query(() => [Product], { name: 'products' })
  async searchAndPaginate(
    @Args('page') page: number,
    @Args('pageSize') pageSize: number,
    @Args('minPrice') minPrice: number,
    @Args('maxPrice') maxPrice: number,
    @Args('title') title: string,
    @Args('category') category: string,
    @Args('description') description: string,
  ) {
    try {
      const result = await this.productsService.searchAndPaginate(
        pageSize,
        page,
        minPrice,
        maxPrice,
        title,
        description,
        category,
      );

      if (!result.products || result.products.length === 0) {
        throw new NotFoundException('No products found');
      }
      return result.products;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id') id: number,
    @Args('product') updateProductInput: UpdateProductInput,
  ) {
    return this.productsService.update(id, updateProductInput);
  }

  @Mutation(() => Product)
  delist(
    @Args('id') id: number,
    @Args('status') delistProductInput: DelistProductInput,
  ) {
    return this.productsService.delist(id, delistProductInput);
  }

  @Mutation(() => Product)
  async removeProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Product | null> {
    const removedProduct = await this.productsService.remove(id);

    if (!removedProduct) {
      throw new NotFoundException('No product found');
    }

    return removedProduct;
  }
}
