import type { Metadata } from "next"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import Hero from "@/components/public/Hero"
import Sobre from "@/components/public/Sobre"
import Clientes from "@/components/public/Clientes"
import Servicos from "@/components/public/Servicos"
import Espaco from "@/components/public/Espaco"
import Contato from "@/components/public/Contato"
import { UAParser } from "ua-parser-js"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://espacocarolinadotti.com.br"

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

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings()

  const title       = s.site_title       || "Carolina Dotti — Beleza e Elegância"
  const description = s.site_description || "Espaço de beleza em São Lourenço do Sul, RS."
  const keywords    = s.site_keywords    || ""
  const ogImage     = s.og_image || s.hero_image || undefined

  return {
    title,
    description,
    keywords: keywords || undefined,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "Espaço Carolina Dotti",
      locale: "pt_BR",
      type: "website",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  }
}

function LocalBusinessJsonLd({ settings }: { settings: Awaited<ReturnType<typeof getSettings>> }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "Espaço Carolina Dotti",
    description: settings.site_description,
    url: SITE_URL,
    telephone: settings.whatsapp,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenida Marechal Floriano, 214",
      addressLocality: "São Lourenço do Sul",
      addressRegion: "RS",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -31.3667,
      longitude: -51.9779,
    },
    sameAs: [
      `https://www.instagram.com/${settings.instagram}`,
      `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`,
    ],
    image: settings.og_image || settings.hero_image || undefined,
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    hasMap: settings.maps_url,
    currenciesAccepted: "BRL",
    paymentAccepted: "Cash, Credit Card, Debit Card, Pix",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function HomePage() {
  await trackVisit()

  const settings = await getSettings()

  return (
    <>
      <LocalBusinessJsonLd settings={settings} />
      <main>
        <Hero
          imageUrl={settings.hero_image || undefined}
          imageUrlMobile={settings.hero_image_mobile || undefined}
          title={settings.hero_title || undefined}
          subtitle={settings.hero_subtitle || undefined}
        />
        <Sobre
          imageUrl={settings.about_image || undefined}
          title={settings.about_title || undefined}
          text={settings.about_text || undefined}
        />
        <Clientes />
        <Servicos />
        <Espaco />
        <Contato
          instagram={settings.instagram}
          whatsapp={settings.whatsapp}
          address={settings.address}
          mapsUrl={settings.maps_url}
          title={settings.contact_title || undefined}
          description={settings.contact_description || undefined}
          ctaLabel={settings.contact_cta_label || undefined}
        />
      </main>
    </>
  )
}
