import {
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
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  password: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  firstName: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  lastName: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  about: string;

  @IsDate()
  @IsOptional()
  @Field({ nullable: true })
  birthDate: Date;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  sex: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isAdmin: boolean;
}
