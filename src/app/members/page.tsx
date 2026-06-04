import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import MembersList from "./MembersList"

export default async function MembersPage() {
  const members = await prisma.member.findMany({
    orderBy: { fullName: 'asc' }
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membres</h1>
          <p className="text-gray-500 text-sm">{members.length} membres enregistrés</p>
        </div>
        <Link
          href="/members/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau
        </Link>
      </header>

      <MembersList initialMembers={members} />
    </div>
  )
}
