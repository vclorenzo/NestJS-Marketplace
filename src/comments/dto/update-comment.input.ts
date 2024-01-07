import { IsString } from 'class-validator';
import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @IsString()
  @Field()
  comment: string;
}
