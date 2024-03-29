import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class SearchProductInput extends PartialType(CreateProductInput) {
  @IsString()
  @IsOptional()
  @Field()
  title?: string;

  @IsNumber()
  @IsOptional()
  @Field()
  minPrice?: number;

  @IsNumber()
  @IsOptional()
  @Field()
  maxPrice?: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  image?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  category?: string;
}
