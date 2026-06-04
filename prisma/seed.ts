import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import * as bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'

async function getPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN
  const postgresUrl = process.env.DATABASE_URL

  // On Vercel, pendant le build, 'npx prisma db push' utilise SQLite local par défaut
  // si DATABASE_URL n'est pas défini. On cherche le fichier créé.
  if (process.env.VERCEL && !postgresUrl) {
    const rootDb = path.resolve(process.cwd(), 'dev.db')
    const prismaDb = path.resolve(process.cwd(), 'prisma/dev.db')

    let finalPath = rootDb
    if (fs.existsSync(prismaDb)) {
      if (!fs.existsSync(rootDb) || fs.statSync(prismaDb).size > fs.statSync(rootDb).size) {
        finalPath = prismaDb
      }
    }

    console.log(`Vercel Build: Using database at ${finalPath} (size: ${fs.existsSync(finalPath) ? fs.statSync(finalPath).size : 0} bytes)`)
    const adapter = new PrismaLibSql({ url: `file:${finalPath}` })
    return new PrismaClient({ adapter })
  }

  if (tursoUrl && tursoUrl !== 'undefined') {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken })
    return new PrismaClient({ adapter })
  } else if (postgresUrl && (postgresUrl.startsWith('postgresql://') || postgresUrl.startsWith('postgres://'))) {
    const pool = new pg.Pool({ connectionString: postgresUrl })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } else {
    const dbPath = path.resolve(process.cwd(), 'dev.db')
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
