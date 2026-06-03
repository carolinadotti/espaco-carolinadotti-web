"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Loader2, Globe, FileText, Search, Image, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import TiptapEditor from "@/components/admin/TiptapEditor"
import { slugify } from "@/lib/slug"

interface PostFormProps {
  postId?: string
}

interface FormState {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  published: boolean
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

const EMPTY: FormState = {
  title: "", slug: "", excerpt: "", content: "",
  coverImageUrl: "", published: false,
  seoTitle: "", seoDescription: "", seoKeywords: "",
}

export default function PostForm({ postId }: PostFormProps) {
  const router = useRouter()
  const isEdit = !!postId

  const [form, setForm] = useState<FormState>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  // Load existing post
  useEffect(() => {
    if (!isEdit) return
    fetch(`/api/posts/${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          coverImageUrl: data.coverImageUrl ?? "",
          published: data.published ?? false,
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
          seoKeywords: data.seoKeywords ?? "",
        })
        setSlugManuallyEdited(true) // ao editar, preservar slug existente
        setLoading(false)
      })
      .catch(() => { toast.error("Erro ao carregar post."); setLoading(false) })
  }, [postId, isEdit])

  // Auto-gerar slug a partir do título (apenas se não foi editado manualmente)
  function handleTitleChange(value: string) {
    setForm((p) => ({
      ...p,
      title: value,
      slug: slugManuallyEdited ? p.slug : slugify(value),
    }))
  }

  function regenerateSlug() {
    setForm((p) => ({ ...p, slug: slugify(p.title) }))
    setSlugManuallyEdited(false)
  }

  async function handleSave(publish?: boolean) {
    if (!form.title || !form.excerpt || !form.content) {
      toast.error("Preencha título, resumo e conteúdo.")
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        published: publish !== undefined ? publish : form.published,
      }
      const url  = isEdit ? `/api/posts/${postId}` : "/api/posts"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      const saved = await res.json()
      toast.success(isEdit ? "Post atualizado!" : "Post criado!")
      if (!isEdit) router.push(`/dashboard/blog/${saved.id}`)
      else setForm((p) => ({ ...p, published: saved.published }))
    } catch {
      toast.error("Erro ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Editar Post" : "Novo Post"}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {form.published ? "Publicado no site" : "Rascunho — não visível no site"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {form.published ? (
            <Button variant="outline" onClick={() => handleSave(false)} disabled={saving} className="gap-2">
              <FileText className="w-4 h-4" /> Voltar para rascunho
            </Button>
          ) : (
            <Button variant="outline" onClick={() => handleSave(true)} disabled={saving} className="gap-2">
              <Globe className="w-4 h-4" /> Publicar
            </Button>
          )}
          <Button onClick={() => handleSave()} disabled={saving} className="gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando…</> : <><Save className="w-4 h-4" />Salvar</>}
          </Button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ex: Como escolher a mecha ideal para o seu cabelo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center rounded-md border bg-muted/30 px-3 gap-1.5">
                <span className="text-xs text-muted-foreground shrink-0">/blog/</span>
                <input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true)
                    setForm((p) => ({ ...p, slug: slugify(e.target.value) || e.target.value }))
                  }}
                  className="flex-1 bg-transparent text-sm py-2 outline-none font-mono"
                  placeholder="minha-url-amigavel"
                />
              </div>
              <Button variant="outline" size="icon" onClick={regenerateSlug} title="Regenerar do título">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">URL final: espacocarolinadotti.com.br/blog/{form.slug || "..."}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo (Excerpt) *</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
              rows={2}
              placeholder="Uma frase que resume o post — aparece na listagem e nas redes sociais."
            />
          </div>

          <div className="space-y-2">
            <Label>Conteúdo *</Label>
            <TiptapEditor
              value={form.content}
              onChange={(html) => setForm((p) => ({ ...p, content: html }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Imagem de capa */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Imagem de Capa</CardTitle>
          </div>
          <CardDescription>URL de uma imagem existente no Blob Storage ou deixe em branco.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={form.coverImageUrl}
            onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
            placeholder="https://..."
          />
          {form.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.coverImageUrl}
              alt="preview"
              className="w-full max-h-48 object-cover rounded-md border"
            />
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">SEO</CardTitle>
          </div>
          <CardDescription>
            Deixe em branco para usar o título e resumo do post. Preencha para personalizar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Título SEO</Label>
            <Input
              id="seoTitle"
              value={form.seoTitle}
              onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
              placeholder={form.title || "Título do post (padrão)"}
              maxLength={70}
            />
            <p className="text-xs text-muted-foreground">
              Ideal: até 60 caracteres.{" "}
              <span className={(form.seoTitle || form.title).length > 60 ? "text-destructive font-medium" : ""}>
                {(form.seoTitle || form.title).length}/60
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">Descrição da Página</Label>
            <Textarea
              id="seoDescription"
              value={form.seoDescription}
              onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
              rows={2}
              placeholder={form.excerpt || "Resumo do post (padrão)"}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              Ideal: 120–160 caracteres.{" "}
              <span
                className={
                  (form.seoDescription || form.excerpt).length > 160
                    ? "text-destructive font-medium"
                    : (form.seoDescription || form.excerpt).length < 120 && (form.seoDescription || form.excerpt).length > 0
                      ? "text-amber-500 font-medium"
                      : ""
                }
              >
                {(form.seoDescription || form.excerpt).length}/160
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoKeywords">Palavras-chave</Label>
            <Input
              id="seoKeywords"
              value={form.seoKeywords}
              onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
              placeholder="mechas, cabelo loiro, salão de beleza"
            />
            <p className="text-xs text-muted-foreground">Separadas por vírgula.</p>
          </div>

          <Separator />

          {/* Preview Google */}
          {(form.title || form.excerpt) && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Preview no Google</p>
              <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-base font-medium leading-snug line-clamp-1">
                {form.seoTitle || form.title || "Título do post"}
              </p>
              <p className="text-[#006621] dark:text-[#34a853] text-xs">
                espacocarolinadotti.com.br › blog › {form.slug || "..."}
              </p>
              <p className="text-[#545454] dark:text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {form.seoDescription || form.excerpt || "Descrição do post..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visibilidade */}
      <Card>
        <CardContent className="py-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Publicar no site</p>
            <p className="text-xs text-muted-foreground">Quando ativo, o post fica visível para todos.</p>
          </div>
          <Switch
            checked={form.published}
            onCheckedChange={(v) => setForm((p) => ({ ...p, published: v }))}
          />
        </CardContent>
      </Card>

      {/* Salvar (repetido no final) */}
      <div className="flex justify-end gap-2 pb-8">
        {form.published ? (
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving} className="gap-2">
            <FileText className="w-4 h-4" /> Voltar para rascunho
          </Button>
        ) : (
          <Button variant="outline" onClick={() => handleSave(true)} disabled={saving} className="gap-2">
            <Globe className="w-4 h-4" /> Publicar
          </Button>
        )}
        <Button onClick={() => handleSave()} disabled={saving} className="gap-2">
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando…</> : <><Save className="w-4 h-4" />Salvar</>}
        </Button>
      </div>
    </div>
  )
}
