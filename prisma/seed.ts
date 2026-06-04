import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'

async function getPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  const postgresUrl = process.env.DATABASE_URL

  // On Vercel, pendant le build, 'npx prisma db push' utilise SQLite local par défaut
  // si DATABASE_URL n'est pas défini. On doit s'aligner pour trouver les tables.
  if (process.env.VERCEL && !postgresUrl) {
    console.log('Vercel Build: Using local SQLite to match "db push"')
    return new PrismaClient()
  }

  if (tursoUrl && tursoUrl !== 'undefined') {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  } else if (postgresUrl && (postgresUrl.startsWith('postgresql://') || postgresUrl.startsWith('postgres://'))) {
    const pool = new pg.Pool({ connectionString: postgresUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    return new PrismaClient()
  }
}

async function main() {
  const prisma = await getPrismaClient()
  const hashedPassword = await bcrypt.hash('admin123', 10)

  console.log('Checking for admin account...')

  // Create Admin if not exists
  const admin = await prisma.user.upsert({
    where: { email: 'admin@association.com' },
    update: {},
    create: {
      email: 'admin@association.com',
      name: 'Trésorier Principal',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create Assistant if not exists
  const assistant = await prisma.user.upsert({
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
  console.log({ admin: admin.email, assistant: assistant.email })

  await prisma.$disconnect()
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
