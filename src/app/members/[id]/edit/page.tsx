import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditMemberForm from "./EditMemberForm"

export const dynamic = 'force-dynamic'

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.member.findUnique({
    where: { id }
  })

  if (!member) notFound()

  return <EditMemberForm member={member} />
}
