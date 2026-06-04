import { prisma } from "@/lib/prisma"
import { formatCurrency, cn } from "@/lib/utils"
import {
  Users,
  Wallet,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  BarChart2
} from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

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
    { name: "Total Membres", value: data.totalMembers, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { name: "Membres Actifs", value: data.activeMembers, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { name: "Total Collecté", value: formatCurrency(data.collected), icon: Wallet, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    { name: "Cotisations Ouvertes", value: data.openContributions, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  ]

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Tableau de Bord</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez les finances de votre association avec précision.</p>
        </div>
        <Link
          href="/payments/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95 dark:shadow-none"
        >
          <PlusCircle className="h-5 w-5" />
          Enregistrer un paiement
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card-premium p-6 group">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110", stat.bg, stat.border, "border")}>
                  <Icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.name}</p>
                <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Payments - 2/3 width on desktop */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Derniers Paiements</h2>
            <Link href="/reports" className="group flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
              Voir tout l&apos;historique
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="card-premium overflow-hidden">
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentPayments.length === 0 ? (
                <li className="p-12 text-center text-slate-500 italic">Aucun paiement enregistré pour le moment.</li>
              ) : (
                data.recentPayments.map((payment) => (
                  <li key={payment.id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold shrink-0">
                          {payment.member.fullName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">{payment.member.fullName}</p>
                          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{payment.contribution.title}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">{formatCurrency(payment.amount)}</p>
                        <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest">{new Date(payment.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>

        {/* Quick Actions - 1/3 width on desktop */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Raccourcis</h2>
          <div className="grid gap-4">
            <Link href="/members/new" className="card-premium p-5 flex items-center gap-4 hover:border-indigo-200 hover:bg-indigo-50/30 group">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white">Ajouter un Membre</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Enregistrer un nouvel adhérent</span>
              </div>
            </Link>
            <Link href="/contributions/new" className="card-premium p-5 flex items-center gap-4 hover:border-amber-200 hover:bg-amber-50/30 group">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-110">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white">Nouvelle Cotisation</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Lancer une campagne de collecte</span>
              </div>
            </Link>
            <Link href="/reports" className="card-premium p-5 flex items-center gap-4 hover:border-emerald-200 hover:bg-emerald-50/30 group">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                <BarChart2 className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white">Générer un Rapport</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Exporter les données financières</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
