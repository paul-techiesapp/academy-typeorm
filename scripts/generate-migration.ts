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

// Cross-platform (Windows + macOS/Linux):
//   - `process.execPath` is the ABSOLUTE path to the node binary, so there's
//     no PATH lookup and no ".cmd vs no-extension" difference between OSes.
//   - `--import tsx` registers tsx's TypeScript loader, letting node run the
//     TypeORM CLI (and the .ts DataSource it imports) directly.
//   - execFileSync with an argument array spawns NO shell, so nothing in the
//     arguments is interpreted as shell syntax (defense-in-depth with the
//     name allow-list above).
execFileSync(
  process.execPath,
  [
    "--import",
    "tsx",
    "./node_modules/typeorm/cli.js",
    "-d",
    "src/data-source.ts",
    "migration:generate",
    targetPath,
  ],
  { stdio: "inherit" }
);
