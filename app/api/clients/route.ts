import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const photos = await prisma.clientPhoto.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(photos)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, order, active } = body

    const photo = await prisma.clientPhoto.create({
      data: {
        title: title ? String(title) : "",
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
