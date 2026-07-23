import { z } from "../openapi/zod";

/** Full Post as returned by the API. */
export const PostSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    title: z.string().openapi({ example: "First Post" }),
    content: z.string().openapi({ example: "Hello world" }),
    userId: z.number().int().openapi({ example: 1 }),
    createdAt: z.string().openapi({ format: "date-time" }),
    updatedAt: z.string().openapi({ format: "date-time" }),
  })
  .openapi("Post");

/** Request body for POST /posts. */
export const CreatePostSchema = z
  .object({
    title: z.string().min(1).max(200).openapi({ example: "First Post" }),
    content: z.string().min(1).openapi({ example: "Hello world" }),
    userId: z.number().int().positive().openapi({ example: 1 }),
  })
  .openapi("CreatePostInput");

export type CreatePostBody = z.infer<typeof CreatePostSchema>;
