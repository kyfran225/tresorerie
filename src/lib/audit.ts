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
  try {
    // Vérifier si l'utilisateur existe pour éviter l'erreur de clé étrangère
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    })

    if (!userExists) {
      console.warn(`AuditLog: User ${userId} not found in database. Skipping log for ${entity}/${action}.`)
      return null
    }

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
  } catch (error) {
    console.error('Failed to create audit log:', error)
    // On ne bloque pas l'action principale si l'audit échoue
    return null
  }
}
