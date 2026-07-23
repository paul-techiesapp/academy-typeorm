import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { userRouter } from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Middleware
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", db: AppDataSource.isInitialized ? "up" : "down" });
});

// Feature routes
app.use("/users", userRouter);

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
