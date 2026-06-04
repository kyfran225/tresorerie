import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import * as bcrypt from 'bcryptjs'

async function main() {
  const connectionString = process.env.TURSO_DATABASE_URL || 'file:./dev.db'
  const authToken = process.env.TURSO_AUTH_TOKEN

  const client = createClient({
    url: connectionString,
    authToken: authToken,
  })

  const adapter = new PrismaLibSql(client)
  const prisma = new PrismaClient({ adapter })

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create Admin
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

  // Create Assistant
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
