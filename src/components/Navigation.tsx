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
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { name: "Tableau de bord", href: "/", icon: Home },
  { name: "Membres", href: "/members", icon: Users },
  { name: "Cotisations", href: "/contributions", icon: Settings },
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white px-2 py-3 md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs transition-colors",
                isActive ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              )}
            >
              <Icon className="h-6 w-6" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r bg-white md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-xl font-bold text-blue-600">Trésorerie</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-4">
          <div className="mb-4 flex items-center gap-3 px-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {session.user?.name?.[0]}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">{session.user?.name}</p>
              <p className="truncate text-xs text-gray-500">{(session.user as any).role}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  )
}
