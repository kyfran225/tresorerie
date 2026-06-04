import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import * as bcrypt from 'bcryptjs'

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

async function main() {
  const url = normalizeEnvVar(process.env.TURSO_DATABASE_URL) ?? normalizeEnvVar(process.env.DATABASE_URL)
  const authToken = normalizeEnvVar(process.env.TURSO_AUTH_TOKEN)

  if (!url) throw new Error('No DB URL found')

  const adapter = new PrismaLibSql({ url, authToken })
  const prisma = new PrismaClient({ adapter })

  const hashedPassword = await bcrypt.hash('admin123', 10)

  console.log('Seeding Turso database...')

  await prisma.user.upsert({
    where: { email: 'admin@association.com' },
    update: {},
    create: {
      email: 'admin@association.com',
      name: 'Trésorier Principal',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'assistant@association.com' },
    update: {},
    create: {
      email: 'assistant@association.com',
      name: 'Trésorier Adjoint',
      password: hashedPassword,
      role: 'ASSISTANT',
    },
  })

  console.log('Seed finished successfully')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
