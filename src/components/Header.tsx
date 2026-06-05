"use client"

import { signOut, useSession } from "next-auth/react"
import { LogOut, User as UserIcon, Bell, ChevronDown, CreditCard } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function Header() {
  const { data: session } = useSession()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session) return null

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b bg-card/70 backdrop-blur-xl md:left-64 border-border">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Trésorerie</span>
          </div>
        </div>

        <div className="flex items-center gap-3 relative" ref={menuRef}>
          <button className="p-2.5 rounded-xl text-secondary hover:text-foreground hover:bg-background transition-all">
            <Bell className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1 hover:bg-background transition-all"
          >
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-sm">
              {session.user?.name?.[0]}
            </div>
            <ChevronDown className={cn("h-4 w-4 text-secondary transition-transform duration-200", isUserMenuOpen && "rotate-180")} />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl border bg-card p-2 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in duration-200 border-border">
              <div className="px-4 py-3 border-b mb-1 border-border">
                <p className="text-sm font-bold text-foreground">{session.user?.name}</p>
                <p className="text-xs text-secondary truncate">{session.user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
