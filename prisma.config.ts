import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Utilise DATABASE_URL si présent, sinon le fichier local (SQLite)
    // Note: Le CLI Prisma ne supporte pas nativement libsql:// pour Turso.
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});