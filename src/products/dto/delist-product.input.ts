import { IsBoolean } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class DelistProductInput extends PartialType(CreateProductInput) {
  @IsBoolean()
  @Field()
  isListed: boolean;
}
