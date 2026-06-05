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
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative group max-w-2xl mx-auto w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
          <Search className="h-5 w-5 text-secondary group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-2xl border border-border bg-card py-4 pl-14 pr-5 text-base placeholder-secondary shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
          placeholder="Rechercher par nom, téléphone ou email..."
        />
      </div>

      {/* Members Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredMembers.length === 0 ? (
          <div className="md:col-span-2 card-premium border-dashed p-16 text-center">
            <div className="mx-auto h-20 w-20 rounded-full bg-background flex items-center justify-center mb-6 border border-border">
              <UserIcon className="h-10 w-10 text-secondary/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Aucun résultat</h3>
            <p className="text-secondary">
              {search ? "Nous n'avons trouvé aucun membre correspondant à votre recherche." : "Votre liste de membres est vide. Ajoutez votre premier membre !"}
            </p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/members/${member.id}`}
              className="card-premium p-4 sm:p-5 flex items-center justify-between card-premium-hover group"
            >
              <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1">
                <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-primary/10 flex shrink-0 items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white shadow-sm">
                  <UserIcon className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] sm:text-lg font-black text-foreground group-hover:text-primary transition-colors truncate">
                    {member.fullName}
                  </h3>
                  <div className="flex flex-col gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                    <span className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wider">
                      <Phone className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-secondary/70" />
                      {member.phone}
                    </span>
                    {member.email && (
                      <span className="hidden xs:flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-secondary/60 min-w-0">
                        <Mail className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                        <span className="truncate">{member.email}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 ml-2 shrink-0">
                <span className={cn(
                  "px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest",
                  member.status === 'ACTIVE'
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
                    : "bg-background text-secondary border border-border"
                )}>
                  <span className="hidden sm:inline">{member.status === 'ACTIVE' ? 'Actif' : member.status}</span>
                  <span className="sm:hidden">{member.status === 'ACTIVE' ? 'Act' : 'In'}</span>
                </span>
                <div className="p-1 sm:p-2 rounded-lg text-secondary/30 group-hover:text-secondary transition-colors">
                   <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
