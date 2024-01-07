import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  @Exclude()
  id: number;

  @Column()
  @Field()
  comment: string;

  @Column()
  @Field((type) => Int)
  userId: number;

  @ManyToOne(() => User, (user) => user.comments)
  @Field((type) => User)
  user: User;

  // @Column()
  // @Field((type) => Int)
  // productId: number;

  // @ManyToOne(() => Product, (product) => product.comments)
  // @Field((type) => Product)
  // product: Product;
}
