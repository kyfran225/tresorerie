"use client"

import { useState, useMemo } from "react"
import {
  BarChart3,
  PieChart,
  Search,
  Calendar,
  Filter,
  Download,
  Eye,
  FileText
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import ExportButtons from "./ExportButtons"
import Link from "next/link"

interface Member {
  id: string
  fullName: string
}

interface Contribution {
  id: string
  title: string
}

interface User {
  id: string
  name: string | null
}

interface Payment {
  id: string
  amount: number
  date: Date | string
  method: string
  receiptNumber: string
  member: Member
  contribution: Contribution
  recordedBy: User
}

interface ReportsClientProps {
  initialPayments: Payment[]
  members: Member[]
  contributions: Contribution[]
  memberStats: { status: string; _count: number }[]
}

export default function ReportsClient({
  initialPayments,
  members,
  contributions,
  memberStats
}: ReportsClientProps) {
  const [search, setSearch] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())
  const [selectedContribution, setSelectedContribution] = useState<string>("all")

  // Generate years for filter (current year and 5 years back)
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())
  }, [])

  const months = [
    { value: "0", label: "Janvier" },
    { value: "1", label: "Février" },
    { value: "2", label: "Mars" },
    { value: "3", label: "Avril" },
    { value: "4", label: "Mai" },
    { value: "5", label: "Juin" },
    { value: "6", label: "Juillet" },
    { value: "7", label: "Août" },
    { value: "8", label: "Septembre" },
    { value: "9", label: "Octobre" },
    { value: "10", label: "Novembre" },
    { value: "11", label: "Décembre" },
  ]

  // Filter Logic
  const filteredPayments = useMemo(() => {
    return initialPayments.filter(p => {
      const pDate = new Date(p.date)
      const matchesSearch =
        p.member.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.receiptNumber.toLowerCase().includes(search.toLowerCase())

      const matchesMonth = selectedMonth === "all" || pDate.getMonth().toString() === selectedMonth
      const matchesYear = selectedYear === "all" || pDate.getFullYear().toString() === selectedYear
      const matchesContrib = selectedContribution === "all" || p.contribution.id === selectedContribution

      return matchesSearch && matchesMonth && matchesYear && matchesContrib
    })
  }, [initialPayments, search, selectedMonth, selectedYear, selectedContribution])

  const totalCollected = useMemo(() =>
    filteredPayments.reduce((sum, p) => sum + p.amount, 0),
  [filteredPayments])

  const exportData = useMemo(() => filteredPayments.map(p => ({
    'Reçu': p.receiptNumber,
    'Date': new Date(p.date).toLocaleDateString('fr-FR'),
    'Membre': p.member.fullName,
    'Cotisation': p.contribution.title,
    'Montant': p.amount,
    'Méthode': p.method,
    'Enregistré par': p.recordedBy.name
  })), [filteredPayments])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rapports & Exports</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Analysez et exportez les données financières filtrées</p>
        </div>
        <ExportButtons data={exportData} />
      </header>

      {/* Filters Bar */}
      <div className="grid gap-4 md:grid-cols-4 bg-white dark:bg-gray-800 p-4 rounded-xl border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Membre ou Reçu..."
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            className="w-full py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">Tous les mois</option>
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            className="w-full py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <select
          className="w-full py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={selectedContribution}
          onChange={(e) => setSelectedContribution(e.target.value)}
        >
          <option value="all">Toutes les cotisations</option>
          {contributions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Synthèse Financière */}
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">Synthèse Financière</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Total Collecté</span>
              <span className="font-bold text-lg text-green-600 dark:text-green-400">{formatCurrency(totalCollected)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">Nombre de Paiements</span>
              <span className="font-bold dark:text-white">{filteredPayments.length}</span>
            </div>
          </div>
        </div>

        {/* État des Membres */}
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
              <PieChart className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white">État des Membres</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {memberStats.map(stat => (
              <div key={stat.status} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700 text-center">
                <span className="block text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">{stat.status}</span>
                <span className="text-xl font-bold dark:text-white">{stat._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historique Récent */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Historique des Transactions ({filteredPayments.length})</h2>
          {filteredPayments.length > 0 && (
            <span className="text-xs text-gray-500">Affichage de tous les résultats filtrés</span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border bg-white dark:bg-gray-800 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Réf / Date</th>
                <th className="px-4 py-3">Membre</th>
                <th className="px-4 py-3">Cotisation</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400 dark:text-gray-500 italic">
                    Aucune transaction ne correspond à vos filtres
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900 dark:text-white">{p.receiptNumber}</div>
                      <div className="text-[10px] text-gray-500">{new Date(p.date).toLocaleDateString('fr-FR')}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/members/${p.member.id}`} className="font-medium text-blue-600 hover:underline">
                        {p.member.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                        {p.contribution.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/payments?search=${p.receiptNumber}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                        Voir
                      </Link>
                    </td>
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
