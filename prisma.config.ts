import { defineConfig } from "prisma/config";
import path from "path";

const getDatabaseUrl = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // On Vercel, pendant le build, on force SQLite local.
  if (process.env.VERCEL && process.env.NEXT_PHASE === 'phase-production-build') {
    return `file:${path.resolve(process.cwd(), "dev.db")}`;
  }

  if (tursoUrl && tursoUrl !== 'undefined') {
    return tursoUrl;
  }

  return process.env.DATABASE_URL || `file:${path.resolve(process.cwd(), "dev.db")}`;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getDatabaseUrl(),
  },
});