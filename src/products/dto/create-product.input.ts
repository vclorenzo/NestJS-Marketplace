import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @IsString()
  @Field()
  name: string;

  @IsNumber()
  @Field()
  price: number;

  @IsString()
  @Field()
  image: string;

  @IsString()
  @Field()
  description: string;

  @IsString()
  @Field()
  category: string;

  @IsInt()
  @Field((type) => Int)
  userId: number;
}
