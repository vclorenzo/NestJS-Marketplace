import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @IsInt()
  @Field((type) => Int)
  userId: number;

  @IsInt()
  @Field((type) => Int)
  productId: number;
}
