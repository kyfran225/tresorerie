"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateMember } from "@/app/actions/members"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

interface EditMemberFormProps {
  member: {
    id: string
    fullName: string
    phone: string
    email: string | null
    notes: string | null
    status: string
  }
}

export default function EditMemberForm({ member }: EditMemberFormProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      await updateMember(member.id, formData)
      router.push(`/members/${member.id}`)
      router.refresh()
    } catch (error: any) {
      alert(error.message || "Une erreur est survenue lors de la modification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href={`/members/${member.id}`} className="p-2 hover:bg-background rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-secondary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Modifier le Profil</h1>
          <p className="text-secondary text-sm">Mise à jour des informations de {member.fullName}</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="card-premium p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet *</label>
            <input
              name="fullName"
              type="text"
              required
              defaultValue={member.fullName}
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone *</label>
              <input
                name="phone"
                type="tel"
                required
                defaultValue={member.phone}
                className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
                placeholder="Ex: 0102030405"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Statut *</label>
              <select
                name="status"
                required
                defaultValue={member.status}
                className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              >
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={member.email || ""}
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              placeholder="Ex: jean@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes / Remarques</label>
            <textarea
              name="notes"
              rows={3}
              defaultValue={member.notes || ""}
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex justify-center items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <Save className="h-5 w-5" />
                Enregistrer les modifications
              </>
            )}
          </button>
          <Link
            href={`/members/${member.id}`}
            className="flex-1 flex justify-center items-center rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-card transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
