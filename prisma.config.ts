import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Utilise DATABASE_URL si présent (Vercel/Postgres), sinon le fichier local (SQLite)
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});