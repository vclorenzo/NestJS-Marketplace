import { IsBoolean } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class DeactivateUserInput extends PartialType(CreateUserInput) {
  @IsBoolean()
  @Field()
  isActive: boolean;
}
