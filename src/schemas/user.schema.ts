import { z } from "../openapi/zod";

/**
 * Full User as returned by the API (the "response shape").
 * The `.openapi("User")` id registers it as a reusable component so it shows
 * up under `components.schemas.User` and is referenced via `$ref`.
 */
export const UserSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    firstName: z.string().openapi({ example: "Ada" }),
    lastName: z.string().openapi({ example: "Lovelace" }),
    email: z.email().openapi({ example: "ada@example.com" }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.string().openapi({ format: "date-time" }),
    updatedAt: z.string().openapi({ format: "date-time" }),
  })
  .openapi("User");

/** Request body for POST /users. Validated at runtime AND documented. */
export const CreateUserSchema = z
  .object({
    firstName: z.string().min(1).max(100).openapi({ example: "Ada" }),
    lastName: z.string().min(1).max(100).openapi({ example: "Lovelace" }),
    email: z.email().openapi({ example: "ada@example.com" }),
  })
  .openapi("CreateUserInput");

/** Request body for PUT /users/:id — every field optional. */
export const UpdateUserSchema = CreateUserSchema.partial().openapi(
  "UpdateUserInput"
);

// Static types DERIVED from the schemas — keeps types and validation in sync.
export type CreateUserBody = z.infer<typeof CreateUserSchema>;
export type UpdateUserBody = z.infer<typeof UpdateUserSchema>;
