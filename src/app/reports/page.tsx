import { prisma } from "@/lib/prisma"
import ReportsClient from "./ReportsClient"

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const [payments, contributions, memberStats] = await Promise.all([
    prisma.payment.findMany({
      include: {
        member: { select: { id: true, fullName: true } },
        contribution: { select: { id: true, title: true } },
        recordedBy: { select: { id: true, name: true } }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.contribution.findMany({
      select: { id: true, title: true }
    }),
    prisma.member.groupBy({
      by: ['status'],
      _count: true
    })
  ])

  // Conversion des dates pour éviter les problèmes de sérialisation Client/Server
  const serializedPayments = payments.map(p => ({
    ...p,
    date: p.date.toISOString()
  }))

  return (
    <ReportsClient
      initialPayments={serializedPayments}
      members={payments.map(p => p.member)} // Simple liste extraite des paiements pour le filtrage
      contributions={contributions}
      memberStats={memberStats}
    />
  )
}
