"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, Loader2, Globe, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  published: boolean
  publishedAt: string | null
  createdAt: string
}

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function BlogAdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/posts?all=1")
    setPosts(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/posts/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Post removido.")
      load()
    } catch {
      toast.error("Erro ao remover.")
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os posts do blog. Posts publicados ficam visíveis no site.
          </p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/dashboard/blog/new")}>
          <Plus className="w-4 h-4" /> Novo Post
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
            <FileText className="w-8 h-8 opacity-40" />
            <p className="text-sm">Nenhum post ainda. Crie o primeiro!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {post.published ? (
                      <Badge className="gap-1 text-xs">
                        <Globe className="w-3 h-3" /> Publicado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <FileText className="w-3 h-3" /> Rascunho
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {post.published ? formatDate(post.publishedAt) : `Criado em ${formatDate(post.createdAt)}`}
                    </span>
                  </div>
                  <p className="font-semibold text-sm truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-lg mt-0.5">{post.excerpt}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">/blog/{post.slug}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {post.published && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver no site"
                      className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <Link
                    href={`/dashboard/blog/${post.id}`}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <Button
                    variant="ghost" size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O post será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
