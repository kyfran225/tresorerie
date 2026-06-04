import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { FileText, Download, BarChart3, PieChart } from "lucide-react"
import ExportButtons from "./ExportButtons"

export default async function ReportsPage() {
  const [payments, contributions, memberStats] = await Promise.all([
    prisma.payment.findMany({
      include: { member: true, contribution: true, recordedBy: true },
      orderBy: { date: 'desc' }
    }),
    prisma.contribution.findMany(),
    prisma.member.groupBy({
      by: ['status'],
      _count: true
    })
  ])

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0)

  // Transformation des données pour l'export
  const exportData = payments.map(p => ({
    'Reçu': p.receiptNumber,
    'Date': new Date(p.date).toLocaleDateString('fr-FR'),
    'Membre': p.member.fullName,
    'Cotisation': p.contribution.title,
    'Montant': p.amount,
    'Méthode': p.method,
    'Enregistré par': p.recordedBy.name
  }))

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Exports</h1>
          <p className="text-gray-500 text-sm">Analysez et exportez les données financières</p>
        </div>
        <ExportButtons data={exportData} />
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Synthèse Financière */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-gray-900">Synthèse Financière</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-500">Total Collecté</span>
              <span className="font-bold text-lg text-green-600">{formatCurrency(totalCollected)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-500">Nombre de Paiements</span>
              <span className="font-bold">{payments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Cotisations Actives</span>
              <span className="font-bold">{contributions.filter(c => c.status === 'OPEN').length}</span>
            </div>
          </div>
        </div>

        {/* État des Membres */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <PieChart className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-gray-900">État des Membres</h2>
          </div>
          <div className="space-y-4">
            {memberStats.map(stat => (
              <div key={stat.status} className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-500">{stat.status}</span>
                <span className="font-bold">{stat._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historique Récent */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Historique des Transactions</h2>
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Membre</th>
                <th className="px-4 py-3">Cotisation</th>
                <th className="px-4 py-3 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400 italic">Aucune donnée disponible</td>
                </tr>
              ) : (
                payments.slice(0, 10).map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">{new Date(p.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.member.fullName}</td>
                    <td className="px-4 py-3 text-gray-500">{p.contribution.title}</td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600">{formatCurrency(p.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
