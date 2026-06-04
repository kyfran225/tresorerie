import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { CreditCard, Search, Filter, Plus } from "lucide-react"
import Link from "next/link"
import ReceiptDownloadButton from "./ReceiptDownloadButton"

export const dynamic = 'force-dynamic'

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      member: true,
      contribution: true,
      recordedBy: true
    },
    orderBy: {
      date: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historique des Paiements</h1>
          <p className="text-gray-500 text-sm">{payments.length} transactions enregistrées</p>
        </div>
        <Link
          href="/payments/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Enregistrer
        </Link>
      </header>

      {/* Search & Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Rechercher par membre ou reçu..."
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Filter className="h-4 w-4 text-gray-400" />
          Filtres
        </button>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reçu N°</th>
                <th className="px-6 py-4">Membre</th>
                <th className="px-6 py-4">Cotisation</th>
                <th className="px-6 py-4">Méthode</th>
                <th className="px-6 py-4 text-right">Montant</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center gap-2">
                      <CreditCard className="h-12 w-12 text-gray-200" />
                      <p>Aucun paiement trouvé</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {payment.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-900">{payment.member.fullName}</p>
                      <p className="text-[10px] text-gray-400">{payment.member.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                        {payment.contribution.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReceiptDownloadButton payment={payment} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
