import { prisma } from "@/lib/prisma"
import { formatCurrency, cn } from "@/lib/utils"
import {
  Banknote,
  Calendar,
  Users,
  ArrowLeft,
  ChevronRight,
  Settings
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function ContributionDetailsPage({ params }: { params: { id: string } }) {
  const contribution = await prisma.contribution.findUnique({
    where: { id: params.id },
    include: {
      payments: {
        include: {
          member: true,
          recordedBy: true
        },
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!contribution) notFound()

  const totalCollected = contribution.payments.reduce((sum, p) => sum + p.amount, 0)
  const uniqueMembers = new Set(contribution.payments.map(p => p.memberId)).size

  return (
    <div className="space-y-6">
      <Link
        href="/contributions"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux cotisations
      </Link>

      {/* Header / Info Card */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
            <Banknote className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{contribution.title}</h1>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                contribution.status === 'OPEN' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              )}>
                {contribution.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1 text-blue-600 font-bold">
                {formatCurrency(contribution.amount)}
              </div>
              <div className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                Type: {contribution.type}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Début le {new Date(contribution.startDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          <div className="text-right border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Collecté</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Users className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Membres ayant payé</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{uniqueMembers}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Banknote className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Nombre de paiements</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{contribution.payments.length}</p>
        </div>
      </div>

      {/* Payments History */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          Historique des Paiements Reçus
        </h2>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Membre</th>
                  <th className="px-6 py-4">Méthode</th>
                  <th className="px-6 py-4 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contribution.payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                      Aucun paiement pour cette cotisation
                    </td>
                  </tr>
                ) : (
                  contribution.payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(p.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/members/${p.memberId}`} className="font-semibold text-blue-600 hover:underline">
                          {p.member.fullName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {p.method}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
