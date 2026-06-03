import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import Header from "@/components/public/Header"
import Hero from "@/components/public/Hero"
import Sobre from "@/components/public/Sobre"
import Servicos from "@/components/public/Servicos"
import Contato from "@/components/public/Contato"
import Footer from "@/components/public/Footer"
import { UAParser } from "ua-parser-js"

async function trackVisit() {
  try {
    const headersList = await headers()
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    const parser = new UAParser(userAgent)
    const browser = parser.getBrowser().name || "unknown"
    const os = parser.getOS().name || "unknown"

    await prisma.visit.create({
      data: { ip, userAgent, browser, os },
    })
  } catch {
    // never throw on tracking
  }
}

export default async function HomePage() {
  await trackVisit()

  const settings = await getSettings()

  return (
    <>
      <Header />
      <main>
        <Hero imageUrl={settings.hero_image || undefined} />
        <Sobre imageUrl={settings.about_image || undefined} />
        <Servicos />
        <Contato
          instagram={settings.instagram}
          whatsapp={settings.whatsapp}
          address={settings.address}
          mapsUrl={settings.maps_url}
        />
      </main>
      <Footer />
    </>
  )
}
