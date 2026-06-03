import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import { CalendarDays } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog",
  description: "Dicas de beleza, tendências e cuidados capilares do Espaço Carolina Dotti.",
}

function formatDate(iso: Date | string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

export default async function BlogPage() {
  const count = await prisma.post.count({ where: { published: true } })
  if (count === 0) notFound()

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true, title: true, excerpt: true,
      coverImageUrl: true, publishedAt: true,
    },
  })

  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Hero da listagem */}
      <div className="pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
          {settings.site_title}
        </p>
        <h1 className="font-display font-light text-4xl md:text-5xl text-foreground leading-tight">
          Blog
        </h1>
        <div className="w-12 h-px bg-primary mt-6" />
      </div>

      {/* Grid de posts */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto pb-28">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col"
            >
              {/* Imagem */}
              <div className="relative aspect-[16/9] overflow-hidden bg-muted mb-5">
                {post.coverImageUrl ? (
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-display text-4xl font-light text-muted-foreground/30">
                      {post.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Texto */}
              <div className="flex flex-col flex-1">
                <p className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-3">
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(post.publishedAt ?? new Date())}
                </p>
                <h2 className="font-display font-light text-xl text-foreground group-hover:text-primary transition-colors duration-300 leading-snug mb-3">
                  {post.title}
                </h2>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-5 font-body text-xs tracking-[0.2em] uppercase text-primary border-b border-primary pb-0.5 w-fit group-hover:opacity-70 transition-opacity">
                  Ler mais
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
