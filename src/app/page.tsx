import { prisma } from "@/lib/prisma"
import { formatCurrency, cn } from "@/lib/utils"
import {
  Users,
  Wallet,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

async function getDashboardData() {
  const [
    totalMembers,
    activeMembers,
    totalCollected,
    totalExpected,
    openContributions,
    recentPayments
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.contribution.aggregate({ _sum: { amount: true } }),
    prisma.contribution.count({ where: { status: 'OPEN' } }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        member: true,
        contribution: true
      }
    })
  ])

  return {
    totalMembers,
    activeMembers,
    collected: totalCollected._sum.amount || 0,
    expected: totalExpected._sum.amount || 0,
    openContributions,
    recentPayments
  }
}

export default async function Dashboard() {
  const data = await getDashboardData()

  const stats = [
    { name: "Total Membres", value: data.totalMembers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Membres Actifs", value: data.activeMembers, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { name: "Total Collecté", value: formatCurrency(data.collected), icon: Wallet, color: "text-purple-600", bg: "bg-purple-100" },
    { name: "Cotisations Ouvertes", value: data.openContributions, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500 text-sm">Aperçu financier de l&apos;association</p>
        </div>
        <Link
          href="/payments/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Enregistrer</span>
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.name}</p>
                <p className="mt-1 text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions / Recent Payments */}
      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Derniers Paiements</h2>
            <Link href="/reports" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <ul className="divide-y divide-gray-100">
              {data.recentPayments.length === 0 ? (
                <li className="p-8 text-center text-gray-500 italic">Aucun paiement enregistré</li>
              ) : (
                data.recentPayments.map((payment) => (
                  <li key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{payment.member.fullName}</p>
                        <p className="text-sm text-gray-500">{payment.contribution.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{new Date(payment.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        <section>
           <h2 className="text-lg font-semibold text-gray-900 mb-4">Raccourcis</h2>
           <div className="grid grid-cols-1 gap-4">
             <Link href="/members/new" className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:bg-blue-50 transition-colors">
               <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users className="h-5 w-5" /></div>
               <span className="font-medium">Ajouter un Membre</span>
             </Link>
             <Link href="/contributions/new" className="flex items-center gap-3 p-4 bg-white border rounded-xl hover:bg-orange-50 transition-colors">
               <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><AlertCircle className="h-5 w-5" /></div>
               <span className="font-medium">Nouvelle Cotisation</span>
             </Link>
           </div>
        </section>
      </div>
    </div>
  )
}
