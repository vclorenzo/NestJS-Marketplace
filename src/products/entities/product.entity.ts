import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  price: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  image: string;

  @Column()
  @Field()
  description: string;

  @Column()
  @Field()
  category: string;

  @Column({ default: true })
  @Field()
  isListed: boolean;

  @Column()
  @Field((type) => Int)
  userId: number;

  @ManyToOne(() => User, (user) => user.products, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  @Field((type) => User)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  @Field((type) => Comment)
  comments?: Comment[];
}
