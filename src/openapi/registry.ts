import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

/**
 * A single shared registry that collects every schema (component) and route
 * (path) in the API. `openapi/paths.ts` populates it; `openapi/document.ts`
 * reads it to emit the final OpenAPI document.
 */
export const registry = new OpenAPIRegistry();
