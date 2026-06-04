import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import path from 'path'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const getPrismaClient = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  const postgresUrl = process.env.DATABASE_URL

  // Option 1: Turso / LibSQL (Recommended for production if using Turso)
  if (tursoUrl && tursoUrl !== 'undefined') {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  }

  // Option 2: PostgreSQL (Vercel / Standard Postgres)
  if (postgresUrl && (postgresUrl.startsWith('postgresql://') || postgresUrl.startsWith('postgres://'))) {
    const pool = new pg.Pool({ connectionString: postgresUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }

  // Option 3: Local SQLite (Default for development)
  const dbPath = path.resolve(process.cwd(), 'dev.db')
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
