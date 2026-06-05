"use server"

import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createPayment(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Non autorisé")

  const memberId = formData.get("memberId") as string
  const contributionId = formData.get("contributionId") as string
  const amount = parseFloat(formData.get("amount") as string)
  const date = new Date(formData.get("date") as string)
  const method = formData.get("method") as string

  // Generate Receipt Number: R-YYYYMMDD-XXXX
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "")
  const count = await prisma.payment.count()
  const receiptNumber = `REC-${today}-${(count + 1).toString().padStart(4, '0')}`

  const payment = await prisma.payment.create({
    data: {
      memberId,
      contributionId,
      amount,
      date,
      method,
      recordedById: (session.user as any).id,
      receiptNumber,
      receipt: {
        create: {} // Create an empty receipt record
      }
    }
  })

  await createAuditLog({
    userId: (session.user as any).id,
    action: "CREATE",
    entity: "Payment",
    entityId: payment.id,
    newValue: payment
  })

  revalidatePath("/")
  revalidatePath("/payments")
  revalidatePath("/reports")

  return payment
}

export async function deletePayment(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Non autorisé")

  // Find payment first for audit log
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { receipt: true }
  })

  if (!payment) throw new Error("Paiement non trouvé")

  // Delete associated receipt first if it exists (though it should be handled by Prisma if configured, but let's be explicit)
  if (payment.receipt) {
    await prisma.receipt.delete({ where: { paymentId: id } })
  }

  await prisma.payment.delete({
    where: { id }
  })

  await createAuditLog({
    userId: (session.user as any).id,
    action: "DELETE",
    entity: "Payment",
    entityId: id,
    oldValue: payment
  })

  revalidatePath("/")
  revalidatePath("/payments")
  revalidatePath("/reports")
  revalidatePath(`/members/${payment.memberId}`)
  revalidatePath(`/contributions/${payment.contributionId}`)

  return { success: true }
}
