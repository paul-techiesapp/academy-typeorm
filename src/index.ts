import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./data-source";
import { userRouter } from "./routes/user.routes";
import { postRouter } from "./routes/post.routes";
import { buildOpenApiDocument } from "./openapi/document";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Middleware
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", db: AppDataSource.isInitialized ? "up" : "down" });
});

// API documentation — generated from the same Zod schemas used for validation.
// Interactive UI at /docs, raw spec at /docs.json (importable into Postman etc.)
const openApiDocument = buildOpenApiDocument();
app.get("/docs.json", (_req: Request, res: Response) => res.json(openApiDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Feature routes
app.use("/users", userRouter);
app.use("/posts", postRouter);

// Central error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

/**
 * Initialize the DB connection FIRST, then start the HTTP server.
 * Booting Express only after the DataSource is ready guarantees every
 * request has a live connection pool to work with.
 */
AppDataSource.initialize()
  .then(() => {
    console.log("📦 Data Source initialized");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error during Data Source initialization:", error);
    process.exit(1);
  });
