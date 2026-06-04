import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const normalizeEnvVar = (value?: string) => {
  if (!value) return undefined

  let normalized = value.trim()

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim()
  }

  if (!normalized || normalized.toLowerCase() === 'undefined' || normalized.toLowerCase() === 'null') {
    return undefined
  }

  return normalized
}

const getPrismaClient = () => {
  let url = normalizeEnvVar(process.env.TURSO_DATABASE_URL) ?? normalizeEnvVar(process.env.DATABASE_URL)
  let authToken = normalizeEnvVar(process.env.TURSO_AUTH_TOKEN)

  if (!url) {
    url = 'libsql://tresorerie-kyfran.aws-eu-west-1.turso.io'
  }

  if (!authToken && url.includes('authToken=')) {
    try {
      const parsed = new URL(url)
      authToken = normalizeEnvVar(parsed.searchParams.get('authToken') ?? undefined)
    } catch {
      // ignore malformed fallback URL parsing
    }
  }

  if (!authToken) {
    authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA1OTA5MTcsImlkIjoiMDE5ZTkzN2QtMDYwMS03NTVkLWE2NzMtNDljMDA0Njg5OTA3IiwicmlkIjoiZGEwMTU4MzAtNjk2OC00Y2FjLWE3M2QtN2EyNDA0ZDY2MDJjIn0.ZGnJmRjW73LnXAIZDy_fNELQhiD5YT8HGb_EevLzFf3ZHwzOZUH2voDJUtxjYIjyBGQZpsTe-bQNZtz1TDdmDQ'
  }

  const adapter = new PrismaLibSql({
    url,
    authToken
  })

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
