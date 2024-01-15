import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWalletInput extends PartialType(CreateUserInput) {
  @IsNumber()
  @Field()
  walletBalance: number;

  @IsNumber()
  @Field({ nullable: true })
  totalCredits: number;
}
