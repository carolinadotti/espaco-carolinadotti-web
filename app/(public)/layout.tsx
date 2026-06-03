import { prisma } from "@/lib/db"
import Header from "@/components/public/Header"
import Footer from "@/components/public/Footer"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let showBlog = false
  try {
    const count = await prisma.post.count({ where: { published: true } })
    showBlog = count > 0
  } catch {
    // falha silenciosa — sem posts
  }

  return (
    <>
      <Header showBlog={showBlog} />
      {children}
      <Footer />
    </>
  )
}
