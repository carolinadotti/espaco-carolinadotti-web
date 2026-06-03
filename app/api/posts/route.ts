import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { slugify } from "@/lib/slug"

export async function GET(req: NextRequest) {
  const session = await auth()
  const { searchParams } = new URL(req.url)
  const all = searchParams.get("all") === "1"

  try {
    const where = session && all ? {} : { published: true }
    const posts = await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true, slug: true, title: true, excerpt: true,
        coverImageUrl: true, published: true, publishedAt: true,
        createdAt: true, updatedAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { title, excerpt, content, coverImageUrl, published,
            seoTitle, seoDescription, seoKeywords, slug: slugInput } = body

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: "Campos obrigatórios: título, resumo e conteúdo" }, { status: 400 })
    }

    // Gerar slug único
    const base = slugify(slugInput || title)
    let slug = base
    let suffix = 1
    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix++}`
    }

    const post = await prisma.post.create({
      data: {
        slug, title, excerpt, content,
        coverImageUrl: coverImageUrl ?? "",
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        seoTitle: seoTitle ?? "",
        seoDescription: seoDescription ?? "",
        seoKeywords: seoKeywords ?? "",
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
