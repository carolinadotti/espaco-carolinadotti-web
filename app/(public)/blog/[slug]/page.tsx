import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { getSettings } from "@/lib/settings"
import { CalendarDays, ArrowLeft } from "lucide-react"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://espacocarolinadotti.com.br"

function formatDate(iso: Date | string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug, published: true },
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post não encontrado" }

  const title       = post.seoTitle       || post.title
  const description = post.seoDescription || post.excerpt
  const keywords    = post.seoKeywords    || undefined
  const imageUrl    = post.coverImageUrl  || undefined
  const canonical   = `${SITE_URL}/blog/${post.slug}`

  return {
    title,
    description,
    keywords: keywords || undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      locale: "pt_BR",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Carolina Dotti"],
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630, alt: title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPost(slug), getSettings()])

  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImageUrl || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: "Carolina Dotti" },
    publisher: {
      "@type": "Organization",
      name: "Espaço Carolina Dotti",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    keywords: post.seoKeywords || undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="relative h-[50vh] max-h-[520px] w-full overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(var(--background))]" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-6 md:px-12 pb-28">
          {/* Voltar */}
          <div className={post.coverImageUrl ? "-mt-16 relative z-10 mb-10" : "pt-32 mb-10"}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Blog
            </Link>
          </div>

          {/* Meta */}
          <p className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-6">
            <CalendarDays className="w-3 h-3" />
            {formatDate(post.publishedAt ?? post.createdAt)}
          </p>

          {/* Título */}
          <h1 className="font-display font-light text-4xl md:text-5xl text-foreground leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="font-body font-light text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-primary pl-5">
            {post.excerpt}
          </p>

          <div className="w-12 h-px bg-primary mb-10" />

          {/* Conteúdo */}
          <div
            className="prose prose-neutral max-w-none
              prose-headings:font-display prose-headings:font-light
              prose-h2:text-2xl prose-h3:text-xl
              prose-p:font-body prose-p:font-light prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:opacity-70
              prose-blockquote:border-l-primary prose-blockquote:font-display prose-blockquote:font-light prose-blockquote:italic
              prose-li:font-body prose-li:font-light prose-li:text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Rodapé do post */}
          <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-1">Escrito por</p>
              <p className="font-display font-light text-lg text-foreground">Carolina Dotti</p>
            </div>
            <Link
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Agendar Horário
            </Link>
          </div>
        </article>
      </div>
    </>
  )
}
