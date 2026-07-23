import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entities/User";

dotenv.config();

/**
 * The single source of truth for the database connection.
 *
 * This same instance is used by:
 *   - the Express app at runtime (see src/index.ts)
 *   - the TypeORM CLI for generating/running migrations
 *     (see the `-d src/data-source.ts` flag in package.json scripts)
 *
 * Keeping one DataSource avoids config drift between app and migrations.
 */
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_DATABASE ?? "orm_dev",

  // Auto-create schema from entities. Keep false; use migrations instead.
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",

  // Registered entities. Add new entity classes here.
  entities: [User],

  // Glob so both .ts (dev via tsx) and compiled .js (prod) migrations resolve.
  migrations: [__dirname + "/migrations/*.{ts,js}"],

  subscribers: [],
});
