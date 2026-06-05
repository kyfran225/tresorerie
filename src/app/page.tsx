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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
          <p className="text-secondary mt-1">Gérez les finances de votre association avec précision.</p>
        </div>
        <Link
          href="/payments/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 dark:shadow-none"
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
                <div className={cn("p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110", stat.bg, stat.border, "border dark:bg-slate-900/50 dark:border-slate-800")}>
                  <Icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-border" />
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold text-secondary uppercase tracking-wider">{stat.name}</p>
                <p className="mt-1 text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
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
            <h2 className="text-xl font-bold text-foreground">Derniers Paiements</h2>
            <Link href="/reports" className="group flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80">
              Voir tout l&apos;historique
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="card-premium overflow-hidden">
            <ul className="divide-y divide-border">
              {data.recentPayments.length === 0 ? (
                <li className="p-12 text-center text-secondary italic">Aucun paiement enregistré pour le moment.</li>
              ) : (
                data.recentPayments.map((payment) => (
                  <li key={payment.id} className="p-4 sm:p-5 hover:bg-background transition-colors group">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background flex items-center justify-center text-secondary font-bold shrink-0 border border-border">
                          {payment.member.fullName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate text-sm sm:text-base">{payment.member.fullName}</p>
                          <p className="text-xs sm:text-sm text-secondary truncate">{payment.contribution.title}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base sm:text-lg font-black text-foreground">{formatCurrency(payment.amount)}</p>
                        <p className="text-[10px] sm:text-[11px] font-bold text-secondary/60 uppercase tracking-widest">{new Date(payment.date).toLocaleDateString('fr-FR')}</p>
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
          <h2 className="text-xl font-bold text-foreground">Raccourcis</h2>
          <div className="grid gap-4">
            <Link href="/members/new" className="card-premium p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 group">
              <div className="p-3 bg-primary/10 rounded-xl text-primary transition-transform group-hover:scale-110">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-foreground">Ajouter un Membre</span>
                <span className="text-xs text-secondary">Enregistrer un nouvel adhérent</span>
              </div>
            </Link>
            <Link href="/contributions/new" className="card-premium p-5 flex items-center gap-4 hover:border-amber-500/50 hover:bg-amber-500/5 group">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 transition-transform group-hover:scale-110">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-foreground">Nouvelle Cotisation</span>
                <span className="text-xs text-secondary">Lancer une campagne de collecte</span>
              </div>
            </Link>
            <Link href="/reports" className="card-premium p-5 flex items-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 group">
              <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 transition-transform group-hover:scale-110">
                <BarChart2 className="h-6 w-6" />
              </div>
              <div>
                <span className="block font-bold text-foreground">Générer un Rapport</span>
                <span className="text-xs text-secondary">Exporter les données financières</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
