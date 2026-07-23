import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

/**
 * Post is the "many" side of a one-to-many relationship with User.
 *
 * The foreign key (`userId`) physically lives on THIS table — the many side
 * always owns the FK column. `@ManyToOne` is what tells TypeORM to create
 * that column and the constraint.
 */
@Entity({ name: "posts" })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text" })
  content: string;

  // Many posts belong to one user.
  // onDelete: "CASCADE" → deleting a user removes their posts at the DB level.
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "userId" })
  user: User;

  // Exposes the raw FK value without having to load the full User relation.
  @Column({ type: "int" })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
