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
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white/80 backdrop-blur-lg px-2 py-3 md:hidden dark:bg-slate-900/80 dark:border-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 text-[10px] transition-all duration-200",
                isActive ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 hover:text-indigo-600 dark:text-slate-400"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-indigo-50 dark:bg-indigo-900/30 scale-110" : "bg-transparent"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="truncate w-full text-center">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r bg-white md:flex dark:bg-slate-900 dark:border-slate-800">
        <div className="flex h-20 items-center px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Trésorerie</span>
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
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto border-t p-4 dark:border-slate-800">
          <div className="mb-6 flex items-center gap-3 px-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-800">
              {session.user?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{session.user?.name}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                {(session.user as any).role}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 group"
          >
            <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
