import { createClient } from '@libsql/client';
import * as bcrypt from 'bcryptjs';

async function run() {
  const url = "libsql://tresorerie-kyfran.aws-eu-west-1.turso.io";
  const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA1OTA5MTcsImlkIjoiMDE5ZTkzN2QtMDYwMS03NTVkLWE2NzMtNDljMDA0Njg5OTA3IiwicmlkIjoiZGEwMTU4MzAtNjk2OC00Y2FjLWE3M2QtN2EyNDA0ZDY2MDJjIn0.ZGnJmRjW73LnXAIZDy_fNELQhiD5YT8HGb_EevLzFf3ZHwzOZUH2voDJUtxjYIjyBGQZpsTe-bQNZtz1TDdmDQ";

  const client = createClient({ url, authToken });
  const hashedPassword = await bcrypt.hash('admin123', 10);

  console.log("--- INITIALISATION COMPLÈTE TURSO ---");

  try {
    console.log("1. Création des tables...");

    const tables = [
      `CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'ASSISTANT',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS Member (
        id TEXT PRIMARY KEY,
        fullName TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'ACTIVE',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS Contribution (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        amount REAL NOT NULL,
        type TEXT NOT NULL,
        startDate DATETIME NOT NULL,
        endDate DATETIME,
        status TEXT DEFAULT 'OPEN',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      `CREATE TABLE IF NOT EXISTS Payment (
        id TEXT PRIMARY KEY,
        memberId TEXT NOT NULL,
        contributionId TEXT NOT NULL,
        amount REAL NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        method TEXT NOT NULL,
        recordedById TEXT NOT NULL,
        receiptNumber TEXT UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (memberId) REFERENCES Member (id),
        FOREIGN KEY (contributionId) REFERENCES Contribution (id),
        FOREIGN KEY (recordedById) REFERENCES User (id)
      );`,
      `CREATE TABLE IF NOT EXISTS Receipt (
        id TEXT PRIMARY KEY,
        paymentId TEXT UNIQUE NOT NULL,
        fileUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paymentId) REFERENCES Payment (id)
      );`,
      `CREATE TABLE IF NOT EXISTS AuditLog (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        entityId TEXT NOT NULL,
        oldValue TEXT,
        newValue TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES User (id)
      );`
    ];

    for (const sql of tables) {
      await client.execute(sql);
    }

    console.log("2. Création de l'utilisateur Admin...");
    await client.execute({
      sql: "INSERT OR IGNORE INTO User (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      args: ["cladmin123", "Trésorier Principal", "admin@association.com", hashedPassword, "ADMIN"]
    });

    console.log("--- SUCCESS: Toutes les tables sont créées sur Turso ! ---");
  } catch (e) {
    console.error("ERREUR:", e);
  } finally {
    client.close();
  }
}

run();
