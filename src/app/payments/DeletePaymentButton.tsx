"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deletePayment } from "@/app/actions/payments"
import { useRouter } from "next/navigation"

interface DeletePaymentButtonProps {
  paymentId: string
}

export default function DeletePaymentButton({ paymentId }: DeletePaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action est irréversible.")) {
      return
    }

    setLoading(true)
    try {
      await deletePayment(paymentId)
      router.refresh()
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue lors de la suppression")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
      title="Supprimer le paiement"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  )
}
