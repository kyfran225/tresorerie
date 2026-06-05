"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { deleteMember } from "@/app/actions/members"
import { useRouter } from "next/navigation"

interface DeleteMemberButtonProps {
  memberId: string
  hasPayments: boolean
}

export default function DeleteMemberButton({ memberId, hasPayments }: DeleteMemberButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    const message = hasPayments 
      ? "Impossible de supprimer ce membre car il possède des paiements. Désactivez-le plutôt."
      : "Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible."

    if (hasPayments) {
      alert(message)
      return
    }

    if (!confirm(message)) {
      return
    }

    setLoading(true)
    try {
      await deleteMember(memberId)
      router.push("/members")
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
      className="flex items-center justify-center gap-2 w-full rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:grayscale"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Supprimer le membre
        </>
      )}
    </button>
  )
}
