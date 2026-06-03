import { prisma } from "./db"

export interface SiteSettings {
  instagram: string
  whatsapp: string
  address: string
  maps_url: string
  hero_image: string
  about_image: string
}

const DEFAULTS: SiteSettings = {
  instagram: "carolsdotti",
  whatsapp: "+55 53 8103-9103",
  address:
    "Avenida Marechal Floriano, 214, Barrinha, São Lourenço do Sul, RS",
  maps_url:
    "https://www.google.com/maps/search/?api=1&query=Avenida+Marechal+Floriano+214+Barrinha+S%C3%A3o+Louren%C3%A7o+do+Sul+RS",
  hero_image: "",
  about_image: "",
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    for (const row of rows) map[row.key] = row.value
    return { ...DEFAULTS, ...map }
  } catch {
    return DEFAULTS
  }
}
