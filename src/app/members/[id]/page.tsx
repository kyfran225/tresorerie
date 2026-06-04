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
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux membres
      </Link>

      {/* Header / Profile Card */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <UserIcon className="h-10 w-10" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{member.fullName}</h1>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                member.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              )}>
                {member.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
          <div className="text-right border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Cotisé</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
          </div>
        </div>
      </div>

      {/* Stats & Info Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-400" />
              Historique des Paiements
            </h2>
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
              <ul className="divide-y divide-gray-100">
                {member.payments.length === 0 ? (
                  <li className="p-8 text-center text-gray-500 italic">Aucun paiement enregistré</li>
                ) : (
                  member.payments.map((payment) => (
                    <li key={payment.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <div className="flex items-start gap-4">
                         <div className="mt-1 p-2 bg-green-50 rounded-lg text-green-600">
                           <ChevronRight className="h-4 w-4" />
                         </div>
                         <div>
                           <p className="font-bold text-gray-900">{payment.contribution.title}</p>
                           <p className="text-xs text-gray-500">
                             Le {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                           </p>
                         </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">REF: {payment.receiptNumber}</p>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
            <div className="rounded-xl border bg-white p-4 text-sm text-gray-600 min-h-[100px]">
              {member.notes || "Aucune note pour ce membre."}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
            <div className="grid gap-2">
               <Link
                 href={`/payments/new?memberId=${member.id}`}
                 className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
               >
                 Enregistrer un paiement
               </Link>
               <button className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                 Modifier le profil
               </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
