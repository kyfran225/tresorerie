import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const getPrismaClient = () => {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) {
    throw new Error('DATABASE_URL or TURSO_DATABASE_URL must be defined')
  }

  // On utilise LibSQL partout pour la cohérence
  const libsql = createClient({ url, authToken })
  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
