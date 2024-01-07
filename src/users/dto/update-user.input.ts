import { IsEmail, IsInt, IsOptional, IsString, isInt } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsEmail()
  @IsOptional()
  @Field({ nullable: true })
  email: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  password: string;
}
