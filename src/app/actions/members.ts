"use server"

import { prisma } from "@/lib/prisma"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

export async function deleteMember(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Non autorisé")

  const member = await prisma.member.findUnique({
    where: { id },
    include: { _count: { select: { payments: true } } }
  })

  if (!member) throw new Error("Membre non trouvé")
  
  if (member._count.payments > 0) {
    throw new Error("Impossible de supprimer un membre ayant des paiements associés. Désactivez-le plutôt.")
  }

  await prisma.member.delete({
    where: { id }
  })

  await createAuditLog({
    userId: (session.user as any).id,
    action: "DELETE",
    entity: "Member",
    entityId: id,
    oldValue: member
  })

  revalidatePath("/members")
  revalidatePath("/")
  return { success: true }
}

export async function updateMember(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error("Non autorisé")

  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const notes = formData.get("notes") as string
  const status = formData.get("status") as string

  const oldMember = await prisma.member.findUnique({ where: { id } })
  if (!oldMember) throw new Error("Membre non trouvé")

  const member = await prisma.member.update({
    where: { id },
    data: {
      fullName,
      phone,
      email: email || null,
      notes: notes || null,
      status: status || "ACTIVE"
    }
  })

  await createAuditLog({
    userId: (session.user as any).id,
    action: "UPDATE",
    entity: "Member",
    entityId: member.id,
    oldValue: oldMember,
    newValue: member
  })

  revalidatePath("/members")
  revalidatePath(`/members/${id}`)
  revalidatePath("/")
  
  return member
}
