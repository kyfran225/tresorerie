import { prisma } from "@/lib/prisma"
import { formatCurrency, cn } from "@/lib/utils"
import {
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ArrowLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import ReceiptDownloadButton from "../../payments/ReceiptDownloadButton"

export const dynamic = 'force-dynamic'

export default async function MemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      payments: {
        include: {
          contribution: true,
          recordedBy: true
        },
        orderBy: { date: 'desc' }
      }
    }
  })

  if (!member) notFound()

  const totalPaid = member.payments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <Link
        href="/members"
        className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux membres
      </Link>

      {/* Header / Profile Card */}
      <div className="card-premium p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <UserIcon className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{member.fullName}</h1>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                member.status === 'ACTIVE' 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                  : "bg-background text-secondary border border-border"
              )}>
                {member.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-secondary">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {member.phone}
              </div>
              {member.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Inscrit le {new Date(member.joinDate).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          <div className="text-right border-t border-border md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8">
            <p className="text-xs text-secondary uppercase tracking-wider mb-1">Total Cotisé</p>
            <p className="text-3xl font-bold text-primary">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      {/* Stats & Info Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-secondary" />
              Historique des Paiements
            </h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <ul className="divide-y divide-border">
                {member.payments.length === 0 ? (
                  <li className="p-8 text-center text-secondary italic">Aucun paiement enregistré</li>
                ) : (
                  member.payments.map((payment) => (
                    <li key={payment.id} className="p-4 hover:bg-background transition-colors flex items-center justify-between">
                      <div className="flex items-start gap-4">
                         <div className="mt-1 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                           <ChevronRight className="h-4 w-4" />
                         </div>
                         <div>
                           <p className="font-bold text-foreground">{payment.contribution.title}</p>
                           <p className="text-xs text-secondary">
                             Le {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                           </p>
                         </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-bold text-foreground">{formatCurrency(payment.amount)}</p>
                          <p className="text-[10px] text-secondary/50 uppercase tracking-tighter">REF: {payment.receiptNumber}</p>
                        </div>
                        <ReceiptDownloadButton payment={{...payment, member: { fullName: member.fullName, phone: member.phone }}} />
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Notes</h2>
            <div className="card-premium p-4 text-sm text-secondary min-h-[100px]">
              {member.notes || "Aucune note pour ce membre."}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Actions</h2>
            <div className="grid gap-2">
               <Link
                 href={`/payments/new?memberId=${member.id}`}
                 className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-colors"
               >
                 Enregistrer un paiement
               </Link>
               <button className="flex items-center justify-center gap-2 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card transition-colors">
                 Modifier le profil
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
