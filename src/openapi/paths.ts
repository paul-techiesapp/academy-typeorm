import { registry } from "./registry";
import { z } from "./zod";
import { UserSchema, CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema";
import { PostSchema, CreatePostSchema } from "../schemas/post.schema";

/**
 * Composite response shapes for the eager-loaded relations.
 * Defined here (rather than in the schema files) to avoid a circular import
 * between user.schema and post.schema.
 */
const UserWithPostsSchema = UserSchema.extend({
  posts: z.array(PostSchema),
}).openapi("UserWithPosts");

const PostWithUserSchema = PostSchema.extend({
  user: UserSchema,
}).openapi("PostWithUser");

// Shared building blocks.
const IdParam = z.object({
  id: z.string().openapi({ param: { name: "id", in: "path" }, example: "1" }),
});

const json = (schema: z.ZodType) => ({
  content: { "application/json": { schema } },
});

// ─── Users ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "get",
  path: "/users",
  tags: ["Users"],
  summary: "List all users, each with their posts eager-loaded",
  responses: {
    200: { description: "Array of users with posts[]", ...json(z.array(UserWithPostsSchema)) },
  },
});

registry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Get one user with posts eager-loaded",
  request: { params: IdParam },
  responses: {
    200: { description: "The user with posts[]", ...json(UserWithPostsSchema) },
    404: { description: "User not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/users",
  tags: ["Users"],
  summary: "Create a user",
  request: { body: json(CreateUserSchema) },
  responses: {
    201: { description: "Created user", ...json(UserSchema) },
    400: { description: "Validation failed" },
  },
});

registry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Update a user",
  request: { params: IdParam, body: json(UpdateUserSchema) },
  responses: {
    200: { description: "Updated user", ...json(UserSchema) },
    404: { description: "User not found" },
  },
});

registry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["Users"],
  summary: "Delete a user (posts cascade-delete)",
  request: { params: IdParam },
  responses: {
    204: { description: "Deleted" },
    404: { description: "User not found" },
  },
});

// ─── Posts ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: "get",
  path: "/posts",
  tags: ["Posts"],
  summary: "List all posts, each with its author eager-loaded (relations option)",
  responses: {
    200: { description: "Array of posts with user{}", ...json(z.array(PostWithUserSchema)) },
  },
});

registry.registerPath({
  method: "get",
  path: "/posts/query",
  tags: ["Posts"],
  summary: "Same list, but eager-loaded via QueryBuilder leftJoinAndSelect",
  responses: {
    200: { description: "Array of posts with user{}", ...json(z.array(PostWithUserSchema)) },
  },
});

registry.registerPath({
  method: "get",
  path: "/posts/{id}",
  tags: ["Posts"],
  summary: "Get one post with its author eager-loaded",
  request: { params: IdParam },
  responses: {
    200: { description: "The post with user{}", ...json(PostWithUserSchema) },
    404: { description: "Post not found" },
  },
});

registry.registerPath({
  method: "post",
  path: "/posts",
  tags: ["Posts"],
  summary: "Create a post for an existing user",
  request: { body: json(CreatePostSchema) },
  responses: {
    201: { description: "Created post", ...json(PostSchema) },
    400: { description: "Validation failed / unknown userId" },
  },
});
