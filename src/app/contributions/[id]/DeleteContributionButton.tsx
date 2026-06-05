"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteContribution } from "@/app/actions/contributions"
import { useRouter } from "next/navigation"

interface DeleteContributionButtonProps {
  contributionId: string
  hasPayments: boolean
}

export default function DeleteContributionButton({ contributionId, hasPayments }: DeleteContributionButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const message = hasPayments 
      ? "Impossible de supprimer cette cotisation car elle possède des paiements associés. Clôturez-la plutôt."
      : "Êtes-vous sûr de vouloir supprimer cette cotisation ? Cette action est irréversible."

    if (hasPayments) {
      alert(message)
      return
    }

    if (!confirm(message)) {
      return
    }

    setLoading(true)
    try {
      await deleteContribution(contributionId)
      router.push("/contributions")
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue lors de la suppression")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading || hasPayments}
      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:grayscale"
      title={hasPayments ? "Impossible de supprimer (paiements existants)" : "Supprimer la cotisation"}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Trash2 className="h-5 w-5" />
      )}
    </button>
  )
}
