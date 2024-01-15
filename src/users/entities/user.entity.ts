import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Comment } from 'src/comments/entities/comment.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column()
  @Field({ nullable: true })
  about: string;

  @Column({ type: 'date' })
  @Field()
  birthDate: Date;

  @Column()
  @Field()
  sex: string;

  @Column()
  @Field()
  walletBalance: number;

  @Column()
  @Field()
  isAdmin: boolean;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.user)
  @Field((type) => [Product], { nullable: true })
  products?: Product[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];
}
