"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createMember } from "@/app/actions/members"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import Link from "next/link"

export default function NewMemberPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      await createMember(formData)
      router.push("/members")
    } catch (error: any) {
      if (error.message === "Non autorisé") {
        router.push("/login?callbackUrl=/members/new")
      } else {
        alert("Une erreur est survenue lors de la création")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href="/members" className="p-2 hover:bg-background rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6 text-secondary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nouveau Membre</h1>
          <p className="text-secondary text-sm">Ajouter un nouveau membre à l&apos;association</p>
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
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              placeholder="Ex: Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone *</label>
            <input
              name="phone"
              type="tel"
              required
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              placeholder="Ex: 0102030405"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="block w-full rounded-lg py-2.5 px-3 sm:text-sm"
              placeholder="Ex: jean@exemple.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes / Remarques</label>
            <textarea
              name="notes"
              rows={3}
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
                Enregistrer
              </>
            )}
          </button>
          <Link
            href="/members"
            className="flex-1 flex justify-center items-center rounded-lg border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground hover:bg-card transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
