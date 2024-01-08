import { IsInt, IsOptional } from 'class-validator';
import { CreateOrderInput } from './create-order.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @IsInt()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  userId: number;

  @IsInt()
  @IsOptional()
  @Field((type) => Int, { nullable: true })
  productId: number;
}
