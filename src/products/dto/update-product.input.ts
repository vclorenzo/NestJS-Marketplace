import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  name: string;

  @IsNumber()
  @IsOptional()
  @Field({ nullable: true })
  price: number;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  image: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  description: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  category: string;
}
