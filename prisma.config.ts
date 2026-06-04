import { defineConfig } from "prisma/config";
import path from "path";

import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Utilise DATABASE_URL si présent, sinon le fichier local (SQLite)
    // On utilise un chemin absolu pour éviter les décalages sur Vercel
    url: process.env.DATABASE_URL || `file:${path.resolve(process.cwd(), "dev.db")}`,
  },
});