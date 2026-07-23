import { execFileSync } from "node:child_process";

/**
 * Thin wrapper so you can run:
 *
 *     pnpm run migration:generate InitSchema
 *
 * instead of typing the full path. We prepend the fixed `src/migrations/`
 * directory here, then hand off to the real TypeORM CLI (which still needs a
 * path — see the class name / directory split it performs internally).
 */
const name = process.argv[2];

if (!name) {
  console.error("Usage: pnpm run migration:generate <MigrationName>");
  console.error("Example: pnpm run migration:generate AddPostsTable");
  process.exit(1);
}

// Reject anything but a simple identifier so the name can't smuggle in path
// traversal or extra CLI flags.
if (!/^[A-Za-z0-9_]+$/.test(name)) {
  console.error(
    `Invalid migration name "${name}". Use letters, numbers, and underscores only.`
  );
  process.exit(1);
}

const targetPath = `src/migrations/${name}`;

// execFileSync with an argument array — no shell is spawned, so nothing in the
// arguments is interpreted as shell syntax.
execFileSync(
  "tsx",
  [
    "./node_modules/typeorm/cli.js",
    "-d",
    "src/data-source.ts",
    "migration:generate",
    targetPath,
  ],
  { stdio: "inherit" }
);
