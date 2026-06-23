import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { isValidBioIcon } from "@/lib/bio-icons"

const URL_PATTERN = /^(https?:\/\/|mailto:|tel:)/i

function isValidUrl(url: string): boolean {
  return URL_PATTERN.test(url.trim())
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { label, url, icon, order, active } = body

    if (url !== undefined && !isValidUrl(String(url))) {
      return NextResponse.json(
        { error: "URL inválida. Use http://, https://, mailto: ou tel:" },
        { status: 400 }
      )
    }

    const link = await prisma.bioLink.update({
      where: { id },
      data: {
        ...(label !== undefined && { label: String(label).trim() }),
        ...(url !== undefined && { url: String(url).trim() }),
        ...(icon !== undefined && {
          icon: icon && isValidBioIcon(icon) ? icon : "",
        }),
        ...(order !== undefined && { order }),
        ...(active !== undefined && { active }),
      },
    })

    return NextResponse.json(link)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.bioLink.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
