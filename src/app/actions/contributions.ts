"use server"

import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createContribution(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Non autorisé")

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const amount = parseFloat(formData.get("amount") as string)
  const type = formData.get("type") as string
  const startDate = new Date(formData.get("startDate") as string)
  const endDateStr = formData.get("endDate") as string
  const endDate = endDateStr ? new Date(endDateStr) : null

  const contribution = await prisma.contribution.create({
    data: {
      title,
      description: description || null,
      amount,
      type,
      startDate,
      endDate,
      status: "OPEN"
    }
  })

  await createAuditLog({
    userId: (session.user as any).id,
    action: "CREATE",
    entity: "Contribution",
    entityId: contribution.id,
    newValue: contribution
  })

  revalidatePath("/contributions")
  return contribution
}
