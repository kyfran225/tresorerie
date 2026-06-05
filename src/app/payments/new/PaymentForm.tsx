"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createPayment } from "@/app/actions/payments"
import { Loader2, Save } from "lucide-react"

interface PaymentFormProps {
  members: any[]
  contributions: any[]
}

export default function PaymentForm({ members, contributions }: PaymentFormProps) {
  const [loading, setLoading] = useState(false)
  const [selectedContributionId, setSelectedContributionId] = useState("")
  const router = useRouter()

  // Find the amount for the selected contribution to pre-fill
  const selectedContribution = contributions.find(c => c.id === selectedContributionId)
  const defaultAmount = selectedContribution?.amount || ""

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      await createPayment(formData)
      router.push("/payments") // Redirect to payments list
      router.refresh()
    } catch (error: any) {
      if (error.message === "Non autorisé") {
        router.push("/login?callbackUrl=/payments/new")
      } else {
        alert("Une erreur est survenue lors de l'enregistrement")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-premium p-6">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Membre *</label>
          <select
            name="memberId"
            required
            className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
          >
            <option value="">Sélectionner un membre</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.fullName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cotisation *</label>
          <select
            name="contributionId"
            required
            value={selectedContributionId}
            onChange={(e) => setSelectedContributionId(e.target.value)}
            className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
          >
            <option value="">Sélectionner la cotisation</option>
            {contributions.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({c.amount} CFA)</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Montant payé (CFA) *</label>
            <input
              name="amount"
              type="number"
              required
              defaultValue={defaultAmount}
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Moyen de réception *</label>
          <select
            name="method"
            required
            className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
          >
            <option value="CASH">Espèces</option>
            <option value="ORANGE_MONEY">Orange Money</option>
            <option value="MTN_MONEY">MTN Money</option>
            <option value="WAVE">Wave</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-all mt-6"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
          <>
            <Save className="h-5 w-5" />
            Enregistrer le paiement
          </>
        )}
      </button>
    </form>
  )
}
