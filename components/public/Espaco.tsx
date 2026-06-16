import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import EspacoGallery from "./EspacoGallery"

export default async function Espaco() {
  let photos: { id: string; alt: string; imageUrl: string }[] = []

  try {
    photos = await prisma.galleryPhoto.findMany({
      where: { active: true, imageUrl: { not: "" } },
      orderBy: { order: "asc" },
      select: { id: true, alt: true, imageUrl: true },
    })
  } catch {
    // fallback: galeria vazia
  }

  if (photos.length === 0) return null

  const settings = await getSettings()

  return (
    <EspacoGallery
      title={settings.gallery_title || undefined}
      description={settings.gallery_description || undefined}
      photos={photos}
    />
  )
}
