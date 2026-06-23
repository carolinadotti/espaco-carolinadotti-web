import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

const ALLOWED_KEYS = [
  "instagram",
  "whatsapp",
  "address",
  "maps_url",
  "hero_image",
  "hero_image_mobile",
  "hero_title",
  "hero_subtitle",
  "about_image",
  "about_title",
  "about_text",
  "gallery_title",
  "gallery_description",
  "clients_title",
  "clients_description",
  "contact_title",
  "contact_description",
  "contact_cta_label",
  "site_title",
  "site_description",
  "site_keywords",
  "og_image",
  "bio_avatar",
  "bio_title",
]

export async function GET() {
  try {
    const settings = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    for (const s of settings) map[s.key] = s.value
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_KEYS.includes(key)) continue
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
