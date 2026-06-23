import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { isValidBioIcon } from "@/lib/bio-icons"

const URL_PATTERN = /^(https?:\/\/|mailto:|tel:)/i

function isValidUrl(url: string): boolean {
  return URL_PATTERN.test(url.trim())
}

export async function GET() {
  try {
    const links = await prisma.bioLink.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(links)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { label, url, icon, order, active } = body

    if (!label?.trim() || !url?.trim()) {
      return NextResponse.json({ error: "Label e URL são obrigatórios" }, { status: 400 })
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "URL inválida. Use http://, https://, mailto: ou tel:" },
        { status: 400 }
      )
    }

    const iconValue = icon && isValidBioIcon(icon) ? icon : ""

    const link = await prisma.bioLink.create({
      data: {
        label: String(label).trim(),
        url: String(url).trim(),
        icon: iconValue,
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
