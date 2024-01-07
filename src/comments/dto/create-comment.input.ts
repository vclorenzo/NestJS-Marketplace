import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsString()
  @Field()
  comment: string;

  @Field((type) => Int)
  userId: number;

  @Field((type) => Int)
  productId: number;
}
