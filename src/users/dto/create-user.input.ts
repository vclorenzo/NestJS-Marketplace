import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsAlpha,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;

  @IsString()
  @Field()
  firstName: string;

  @IsString()
  @Field()
  lastName: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  about: string;

  @IsDate()
  @Field()
  birthDate: Date;

  @IsString()
  @Field()
  sex: string;

  @IsNumber()
  @Field()
  walletBalance: number;

  @IsBoolean()
  @Field()
  isAdmin: boolean;
}
