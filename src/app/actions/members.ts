"use server"

import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export async function createMember(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Non autorisé")

  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const notes = formData.get("notes") as string

  const member = await prisma.member.create({
    data: {
      fullName,
      phone,
      email: email || null,
      notes: notes || null,
      status: "ACTIVE"
    }
  })

  await createAuditLog({
    userId: (session.user as any).id,
    action: "CREATE",
    entity: "Member",
    entityId: member.id,
    newValue: member
  })

  revalidatePath("/members")
  return member
}
