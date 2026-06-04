"use client"

import { useState } from "react"
import Link from "next/link"
import {
  User as UserIcon,
  Phone,
  Mail,
  MoreVertical,
  Search
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Member {
  id: string
  fullName: string
  phone: string
  email: string | null
  status: string
}

interface MembersListProps {
  initialMembers: Member[]
}

export default function MembersList({ initialMembers }: MembersListProps) {
  const [search, setSearch] = useState("")

  const filteredMembers = initialMembers.filter(m =>
    m.fullName.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    (m.email && m.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Rechercher un membre par nom, téléphone ou email..."
        />
      </div>

      {/* Members Grid */}
      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center text-gray-500 bg-white">
            <UserIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>{search ? "Aucun membre ne correspond à votre recherche." : "Aucun membre trouvé. Commencez par en ajouter un !"}</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/members/${member.id}`}
              className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-colors group-hover:bg-blue-100">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{member.fullName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </span>
                    {member.email && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                  member.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                )}>
                  {member.status}
                </span>
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
