import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const getPrismaClient = () => {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  const postgresUrl = process.env.DATABASE_URL

  // PRIORITÉ 1: Turso / LibSQL (Forcé si sur Vercel)
  if (tursoUrl && tursoUrl !== 'undefined') {
    console.log('Runtime: Using Turso Adapter')
    const adapter = new PrismaLibSql({
      url: tursoUrl,
      authToken: tursoToken
    })
    return new PrismaClient({ adapter })
  }

  // PRIORITÉ 2: PostgreSQL
  if (postgresUrl && (postgresUrl.startsWith('postgresql://') || postgresUrl.startsWith('postgres://'))) {
    console.log('Runtime: Using Postgres Adapter')
    const pool = new pg.Pool({ connectionString: postgresUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }

  // PRIORITÉ 3: Local SQLite (Seulement si pas sur Vercel)
  if (process.env.VERCEL) {
    throw new Error('Production Error: TURSO_DATABASE_URL is missing on Vercel!')
  }

  console.log('Runtime: Using Native SQLite (Local)')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma || getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
