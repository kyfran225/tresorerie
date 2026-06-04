import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Settings, Calendar, Banknote } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function ContributionsPage() {
  const contributions = await prisma.contribution.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cotisations</h1>
          <p className="text-gray-500 text-sm">Gérez les types et montants de cotisations</p>
        </div>
        <Link
          href="/contributions/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Créer
        </Link>
      </header>

      <div className="grid gap-4">
        {contributions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-gray-500 bg-white">
            <Settings className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Aucune cotisation configurée.</p>
          </div>
        ) : (
          contributions.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-500">{c.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(c.amount)}</p>
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1",
                    c.status === 'OPEN' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.3 w-3.5" />
                  <span>Début: {new Date(c.startDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <Link href={`/contributions/${c.id}`} className="text-blue-600 font-medium hover:underline">
                  Gérer
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
