import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import * as bcrypt from 'bcryptjs'

async function main() {
  const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url) throw new Error('No DB URL found')

  const libsql = createClient({ url, authToken })
  const adapter = new PrismaLibSql(libsql)
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
