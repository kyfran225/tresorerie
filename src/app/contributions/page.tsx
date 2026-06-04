import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Settings, Calendar, Banknote, ArrowRight } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"

export const dynamic = 'force-dynamic'

export default async function ContributionsPage() {
  const contributions = await prisma.contribution.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Campagnes de Cotisations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez vos collectes et définissez les montants d&apos;adhésion.</p>
        </div>
        <Link
          href="/contributions/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 dark:shadow-none"
        >
          <Plus className="h-5 w-5" />
          Nouvelle campagne
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contributions.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 card-premium border-dashed p-16 text-center bg-white dark:bg-slate-900/50">
            <div className="mx-auto h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">
              <Settings className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aucune campagne</h3>
            <p className="text-slate-500 dark:text-slate-400">Commencez par créer votre première campagne de collecte de cotisations.</p>
          </div>
        ) : (
          contributions.map((c) => (
            <div
              key={c.id}
              className="card-premium p-5 sm:p-6 flex flex-col h-full group card-premium-hover"
            >
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-sm group-hover:scale-110 transition-transform">
                  <Banknote className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className={cn(
                  "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest",
                  c.status === 'OPEN'
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
                    : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                )}>
                  {c.status === 'OPEN' ? 'Ouverte' : 'Clôturée'}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                <p className="text-[10px] sm:text-sm font-bold text-slate-400 uppercase tracking-wider">{c.type}</p>
                <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(c.amount)}</p>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>{new Date(c.startDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <Link
                  href={`/contributions/${c.id}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 hover:gap-2.5 transition-all"
                >
                  Gérer
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
