import { PrismaClient } from "@prisma/client";

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

// Some Postgres hosting integrations inject the connection string under a
// different variable name instead of DATABASE_URL. Fall back to whichever
// exists, and strip stray quotes/whitespace from dashboard copy-paste.
process.env.DATABASE_URL =
  sanitize(process.env.DATABASE_URL) ||
  sanitize(process.env.POSTGRES_PRISMA_URL) ||
  sanitize(process.env.POSTGRES_URL) ||
  sanitize(process.env.DATABASE_PUBLIC_URL) ||
  sanitize(process.env.DATABASE_URL_UNPOOLED) ||
  sanitize(process.env.POSTGRES_URL_NON_POOLING);

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
