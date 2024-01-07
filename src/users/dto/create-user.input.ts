import { Field, InputType, Int } from '@nestjs/graphql';
import { IsAlpha, IsBoolean, IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;

  @IsBoolean()
  @Field()
  isAdmin: boolean;
}
