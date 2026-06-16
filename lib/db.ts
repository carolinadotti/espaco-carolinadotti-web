import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * O pg/pg-connection-string v3 (e pg v9) vão deixar de tratar 'require',
 * 'prefer' e 'verify-ca' como aliases de 'verify-full', adotando a semântica
 * mais fraca do libpq. Tornamos 'verify-full' explícito para manter a mesma
 * segurança/comportamento atual e silenciar o aviso de depreciação.
 */
function normalizeSslMode(connectionString: string): string {
  return connectionString.replace(
    /sslmode=(require|prefer|verify-ca)\b/gi,
    "sslmode=verify-full"
  )
}

function createPrismaClient() {
  const connectionString = normalizeSslMode(process.env.DATABASE_URL ?? "")
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
