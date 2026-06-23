import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import BioPage from "@/components/public/BioPage"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = settings.bio_title || "Carolina Dotti"
  return {
    title: `${title} — Links`,
    description: settings.site_description,
  }
}

export default async function BioRoutePage() {
  const [settings, links] = await Promise.all([
    getSettings(),
    prisma.bioLink.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: { id: true, label: true, url: true, icon: true },
    }),
  ])

  return (
    <BioPage
      avatarUrl={settings.bio_avatar || undefined}
      title={settings.bio_title?.trim() || undefined}
      links={links}
    />
  )
}
