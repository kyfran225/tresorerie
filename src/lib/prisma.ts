import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: {
      provider: 'sqlite',
      url: 'file:./dev.db',
    } as any
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma