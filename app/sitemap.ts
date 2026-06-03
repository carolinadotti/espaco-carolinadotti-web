import type { MetadataRoute } from "next"
import { prisma } from "@/lib/db"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://espacocarolinadotti.com.br"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  }).catch(() => [])

  const hasPosts = posts.length > 0

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...(hasPosts
      ? [
          {
            url: `${SITE_URL}/blog`,
            lastModified: posts[0].updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
          ...posts.map((p) => ({
            url: `${SITE_URL}/blog/${p.slug}`,
            lastModified: p.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          })),
        ]
      : []),
  ]
}
