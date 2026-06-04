import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'
import path from 'path'

async function getPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  const postgresUrl = process.env.DATABASE_URL

  if (tursoUrl && tursoUrl !== 'undefined') {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  } else if (postgresUrl && (postgresUrl.startsWith('postgresql://') || postgresUrl.startsWith('postgres://'))) {
    const pool = new pg.Pool({ connectionString: postgresUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    // IMPORTANT: On Vercel, the CLI (db push) might use a different path than the runtime.
    // Try both root and prisma/ directory if the first one fails, or just use a fixed path.
    const dbPath = path.resolve(process.cwd(), 'prisma/dev.db')
    console.log(`Using database at: ${dbPath}`)
    const adapter = new PrismaLibSql({ url: `file:${dbPath}` })
    return new PrismaClient({ adapter })
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
