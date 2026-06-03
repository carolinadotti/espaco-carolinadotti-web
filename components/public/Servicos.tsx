import { prisma } from "@/lib/db"
import ServicosAccordion from "./ServicosAccordion"

export default async function Servicos() {
  let services: {
    id: string
    order: number
    title: string
    subtitle: string
    description: string
    imageUrl: string
  }[] = []

  try {
    services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, order: true, title: true, subtitle: true, description: true, imageUrl: true },
    })
  } catch {
    // fallback: accordion vazio
  }

  return <ServicosAccordion services={services} />
}
