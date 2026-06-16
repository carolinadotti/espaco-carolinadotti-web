import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import ClientesCarousel from "./ClientesCarousel"

export default async function Clientes() {
  let photos: { id: string; title: string; imageUrl: string }[] = []

  try {
    photos = await prisma.clientPhoto.findMany({
      where: { active: true, imageUrl: { not: "" } },
      orderBy: { order: "asc" },
      select: { id: true, title: true, imageUrl: true },
    })
  } catch {
    // fallback: sem fotos
  }

  if (photos.length === 0) return null

  const settings = await getSettings()

  return (
    <ClientesCarousel
      title={settings.clients_title || undefined}
      description={settings.clients_description || undefined}
      photos={photos}
    />
  )
}
