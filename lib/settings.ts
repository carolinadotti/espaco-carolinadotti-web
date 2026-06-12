import { prisma } from "./db"

export interface SiteSettings {
  instagram: string
  whatsapp: string
  address: string
  maps_url: string
  hero_image: string
  about_image: string
  about_title: string
  about_text: string
  // SEO
  site_title: string
  site_description: string
  site_keywords: string
  og_image: string
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
  about_title: "Um olhar que\nrevela beleza",
  about_text:
    "Cada pessoa carrega consigo uma beleza singular, muitas vezes adormecida sob a rotina do cotidiano. Meu trabalho é criar um espaço onde essa beleza possa respirar e se revelar naturalmente.\n\nCom anos de dedicação e uma busca constante pela excelência, desenvolvi uma abordagem que valoriza a individualidade de cada cliente. Não transformo — revelo. Não imponho — escuto. O resultado é uma versão sua que você reconhece como a mais autêntica.",
  site_title: "Carolina Dotti — Beleza e Elegância",
  site_description:
    "Espaço de beleza especializado em mechas, coloração, penteados, maquiagem, corte e tratamentos capilares. Atendimento personalizado em São Lourenço do Sul, RS.",
  site_keywords:
    "salão de beleza, mechas, coloração, penteados, maquiagem, corte de cabelo, tratamentos capilares, São Lourenço do Sul, RS",
  og_image: "",
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
