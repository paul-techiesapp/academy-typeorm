import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

/**
 * Monkey-patches `.openapi()` onto Zod's schema prototype (and augments the
 * TypeScript types). This MUST run before any schema calls `.openapi()`.
 *
 * Every schema file imports `z` from HERE rather than directly from "zod",
 * which guarantees the extension is applied first.
 */
extendZodWithOpenApi(z);

export { z };
