import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Express middleware factory: validates `req.body` against a Zod schema.
 *
 * On success it REPLACES req.body with the parsed (and coerced) data, so your
 * handler receives clean, typed input. On failure it short-circuits with a
 * 400 and a list of field-level errors — the routes never see bad data.
 *
 * This is the "double duty" of the schema: the same object that generates the
 * OpenAPI docs also enforces the contract at runtime.
 */
export const validateBody =
  (schema: z.ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    req.body = result.data;
    next();
  };
