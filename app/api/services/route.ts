import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, subtitle, description, imageUrl, order, active } = body

    if (!title || !subtitle || !description) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        title,
        subtitle,
        description,
        imageUrl: imageUrl ?? "",
        order: order ?? 0,
        active: active ?? true,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
