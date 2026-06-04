"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createContribution } from "@/app/actions/contributions"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

export default function NewContributionPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      await createContribution(formData)
      router.push("/contributions")
    } catch (error) {
      alert("Une erreur est survenue lors de la création")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/contributions" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle Cotisation</h1>
          <p className="text-gray-500 text-sm">Définir un nouveau type de cotisation</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                name="title"
                type="text"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Ex: Cotisation Janvier 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="MENSUELLE">Mensuelle</option>
                <option value="ANNUELLE">Annuelle</option>
                <option value="EXCEPTIONNELLE">Exceptionnelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (CFA) *</label>
              <input
                name="amount"
                type="number"
                step="50"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <input
                name="startDate"
                type="date"
                required
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                name="endDate"
                type="date"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Détails sur l'utilisation des fonds..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <Save className="h-5 w-5" />
                Créer la cotisation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
