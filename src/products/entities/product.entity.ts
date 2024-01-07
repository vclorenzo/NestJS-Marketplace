import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  price: number;

  @Column()
  @Field()
  image: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  category: string;

  @Column()
  @Field((type) => Int)
  userId: number;

  @ManyToOne(() => User, (user) => user.products)
  @Field((type) => User)
  user: User;

  // @Column()
  // @Field((type) => Int)
  // commentId: number;

  // @OneToMany(() => Comment, (comment) => comment.product)
  // @Field((type) => Comment)
  // comments?: Comment[];
}