"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Home,
  Users,
  CreditCard,
  PlusCircle,
  BarChart2,
  LogOut,
  Menu,
  HandCoins
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { name: "Tableau de bord", href: "/", icon: Home },
  { name: "Membres", href: "/members", icon: Users },
  { name: "Cotisations", href: "/contributions", icon: HandCoins },
  { name: "Paiements", href: "/payments", icon: CreditCard },
  { name: "Rapports", href: "/reports", icon: BarChart2 },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (!session) return null

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-card/80 backdrop-blur-lg px-2 py-3 md:hidden border-border">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 text-[10px] transition-all duration-200",
                isActive ? "text-primary font-bold" : "text-secondary hover:text-primary"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-primary/10 scale-110" : "bg-transparent"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="truncate w-full text-center">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r bg-card md:flex border-border">
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <CreditCard className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Trésorerie</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-secondary hover:bg-background hover:text-primary"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary-foreground" : "text-secondary group-hover:text-primary"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t p-4 border-border">
          <div className="mb-6 flex items-center gap-3 px-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {session.user?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-foreground">{session.user?.name}</p>
              <p className="truncate text-xs text-secondary uppercase tracking-wider font-semibold">
                {(session.user as any).role}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-500/10 group"
          >
            <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
