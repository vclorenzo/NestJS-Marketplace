import { ObjectType, Field, Int } from '@nestjs/graphql';
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
  isAdmin: boolean;

  @OneToMany(() => Product, (product) => product.user)
  @Field((type) => [Product], { nullable: true })
  products?: Product[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];
}
