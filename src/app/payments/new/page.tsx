import { prisma } from "@/lib/prisma"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PaymentForm from "./PaymentForm"

export const dynamic = 'force-dynamic'

export default async function NewPaymentPage() {
  const [members, contributions] = await Promise.all([
    prisma.member.findMany({ where: { status: 'ACTIVE' }, orderBy: { fullName: 'asc' } }),
    prisma.contribution.findMany({ where: { status: 'OPEN' }, orderBy: { createdAt: 'desc' } })
  ])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/payments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enregistrer un Paiement</h1>
          <p className="text-gray-500 text-sm">Saisir une nouvelle entrée de fonds</p>
        </div>
      </header>

      <PaymentForm members={members} contributions={contributions} />
    </div>
  )
}
