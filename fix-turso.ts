import { createClient } from '@libsql/client';
import * as bcrypt from 'bcryptjs';

async function run() {
  const url = "libsql://tresorerie-kyfran.aws-eu-west-1.turso.io";
  const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA1OTA5MTcsImlkIjoiMDE5ZTkzN2QtMDYwMS03NTVkLWE2NzMtNDljMDA0Njg5OTA3IiwicmlkIjoiZGEwMTU4MzAtNjk2OC00Y2FjLWE3M2QtN2EyNDA0ZDY2MDJjIn0.ZGnJmRjW73LnXAIZDy_fNELQhiD5YT8HGb_EevLzFf3ZHwzOZUH2voDJUtxjYIjyBGQZpsTe-bQNZtz1TDdmDQ";

  const client = createClient({ url, authToken });
  const hashedPassword = await bcrypt.hash('admin123', 10);

  console.log("--- INITIALISATION DIRECTE TURSO ---");

  try {
    console.log("1. Création des tables...");

    // Création manuelle simplifiée des tables essentielles pour débloquer le login
    await client.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'ASSISTANT',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("2. Création de l'utilisateur Admin...");
    await client.execute({
      sql: "INSERT OR IGNORE INTO User (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      args: ["cladmin123", "Trésorier Principal", "admin@association.com", hashedPassword, "ADMIN"]
    });

    console.log("--- SUCCESS: Turso est prêt ! ---");
  } catch (e) {
    console.error("ERREUR:", e);
  }
}

run();
