import { prisma } from "./prisma"

type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT'
type EntityType = 'User' | 'Member' | 'Contribution' | 'Payment'

interface AuditParams {
  userId: string
  action: AuditAction
  entity: EntityType
  entityId: string
  oldValue?: any
  newValue?: any
}

export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  oldValue,
  newValue
}: AuditParams) {
  return await prisma.auditLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
      oldValue: oldValue ? JSON.stringify(oldValue) : null,
      newValue: newValue ? JSON.stringify(newValue) : null,
    }
  })
}
