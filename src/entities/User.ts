import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";

/**
 * Example entity.
 *
 * Each decorator carries TypeScript metadata that TypeORM reads at runtime
 * (enabled by `emitDecoratorMetadata` in tsconfig). This is also what gives
 * you full IDE autocomplete on repository methods like
 * `userRepository.findOneBy({ email })`.
 */
@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  firstName: string;

  @Column({ type: "varchar", length: 100 })
  lastName: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  /**
   * The inverse "one" side of the relationship. This is virtual — no column
   * is created on the users table; TypeORM resolves it via the FK on posts.
   *
   * `eager: true` would auto-load posts on EVERY User query. We deliberately
   * leave it off and opt in per-query via the `relations` option in the
   * routes, which is more flexible and avoids accidental over-fetching.
   */
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
