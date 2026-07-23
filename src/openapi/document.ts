import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "./registry";

// Importing this module for its side effect: it runs all the
// `registry.registerPath(...)` calls, populating the shared registry.
import "./paths";

/**
 * Builds the full OpenAPI 3.0 document from everything registered in the
 * shared registry. Called once at startup and served at /docs.json.
 */
export function buildOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Academy TypeORM API",
      version: "1.0.0",
      description:
        "Express + TypeORM + MySQL boilerplate. Docs auto-generated from Zod " +
        "schemas that also validate requests at runtime.",
    },
    servers: [{ url: "http://localhost:3000" }],
    tags: [
      { name: "Users", description: "User management (one-to-many with posts)" },
      { name: "Posts", description: "Posts belonging to a user" },
    ],
  });
}
