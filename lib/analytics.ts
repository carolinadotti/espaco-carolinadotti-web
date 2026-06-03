import { prisma } from "./db"

export async function getVisitsLast6Months() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const visits = await prisma.visit.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  return aggregateByMonth(visits)
}

export async function getWhatsappClicksLast6Months() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const clicks = await prisma.whatsappClick.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  return aggregateByMonth(clicks)
}

function aggregateByMonth(records: { createdAt: Date }[]) {
  const months: Record<string, number> = {}

  // Build last 6 months as empty buckets
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    months[key] = 0
  }

  for (const record of records) {
    const d = new Date(record.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (key in months) months[key]++
  }

  return Object.entries(months).map(([month, count]) => ({
    month: formatMonth(month),
    count,
  }))
}

function formatMonth(key: string) {
  const [year, month] = key.split("-")
  const d = new Date(Number(year), Number(month) - 1)
  return d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
}
