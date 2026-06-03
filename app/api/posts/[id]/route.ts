import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { slugify } from "@/lib/slug"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
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
    const { title, excerpt, content, coverImageUrl, published,
            seoTitle, seoDescription, seoKeywords, slug: slugInput } = body

    const current = await prisma.post.findUnique({ where: { id } })
    if (!current) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

    // Atualizar slug apenas se fornecido e diferente do atual
    let slug = current.slug
    if (slugInput && slugInput !== current.slug) {
      const base = slugify(slugInput)
      slug = base
      let suffix = 1
      while (await prisma.post.findFirst({ where: { slug, NOT: { id } } })) {
        slug = `${base}-${suffix++}`
      }
    }

    // Determinar publishedAt
    let publishedAt = current.publishedAt
    if (published && !current.published) publishedAt = new Date()
    if (!published) publishedAt = null

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content !== undefined && { content }),
        ...(coverImageUrl !== undefined && { coverImageUrl }),
        ...(published !== undefined && { published, publishedAt }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(seoKeywords !== undefined && { seoKeywords }),
        slug,
      },
    })

    return NextResponse.json(post)
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
    await prisma.post.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
