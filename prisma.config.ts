import "dotenv/config";
import path from "node:path";
import type { PrismaConfig } from "prisma";

// Some Vercel Postgres / Neon integrations inject the connection string under a
// different variable name instead of DATABASE_URL. Fall back to whichever exists.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING;
}

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;
