import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

function sanitize(value: string | undefined) {
  if (!value) return value;
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

// Some Postgres hosting integrations (Vercel Postgres/Neon, Railway, etc.) inject the
// connection string under a different variable name instead of DATABASE_URL. Fall
// back to whichever exists, and strip stray quotes/whitespace that can sneak in when
// a value is copy-pasted from a dashboard.
process.env.DATABASE_URL =
  sanitize(process.env.DATABASE_URL) ||
  sanitize(process.env.POSTGRES_PRISMA_URL) ||
  sanitize(process.env.POSTGRES_URL) ||
  sanitize(process.env.DATABASE_PUBLIC_URL) ||
  sanitize(process.env.DATABASE_URL_UNPOOLED) ||
  sanitize(process.env.POSTGRES_URL_NON_POOLING);

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;
