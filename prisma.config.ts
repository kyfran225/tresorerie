import { defineConfig } from "prisma/config";
import path from "path";

const getDatabaseUrl = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // IMPORTANT: Pendant le BUILD sur Vercel, on utilise SQLite local
  // pour éviter les problèmes de connexion à Turso qui bloquent le déploiement.
  if (process.env.VERCEL && process.env.NEXT_PHASE === 'phase-production-build') {
    return `file:${path.resolve(process.cwd(), "dev.db")}`;
  }

  if (tursoUrl && tursoUrl !== 'undefined') {
    // Construction de l'URL avec token pour le CLI Prisma
    if (tursoToken && !tursoUrl.includes("authToken=")) {
      return `${tursoUrl}${tursoUrl.includes("?") ? "&" : "?"}authToken=${tursoToken}`;
    }
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