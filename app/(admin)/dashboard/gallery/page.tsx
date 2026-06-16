"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus, Pencil, Trash2, GripVertical,
  Loader2, Eye, EyeOff, Image, Save, Type,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import GalleryImageUpload from "@/components/admin/GalleryImageUpload"

interface GalleryPhoto {
  id: string
  order: number
  alt: string
  imageUrl: string
  active: boolean
}

const EMPTY: Omit<GalleryPhoto, "id"> = {
  order: 0, alt: "", imageUrl: "", active: true,
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<GalleryPhoto | null>(null)
  const [form, setForm] = useState<Omit<GalleryPhoto, "id">>(EMPTY)

  // Conteúdo da seção (settings)
  const [content, setContent] = useState({ gallery_title: "", gallery_description: "" })
  const [savingContent, setSavingContent] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/gallery")
    setPhotos(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) =>
        setContent({
          gallery_title: data.gallery_title ?? "",
          gallery_description: data.gallery_description ?? "",
        })
      )
      .catch(() => {})
  }, [load])

  async function handleSaveContent() {
    setSavingContent(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error()
      toast.success("Conteúdo da seção salvo!")
    } catch {
      toast.error("Erro ao salvar. Tente novamente.")
    } finally {
      setSavingContent(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY, order: photos.length + 1 })
    setDialogOpen(true)
  }

  function openEdit(p: GalleryPhoto) {
    setEditing(p)
    setForm({ order: p.order, alt: p.alt, imageUrl: p.imageUrl, active: p.active })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const url = editing ? `/api/gallery/${editing.id}` : "/api/gallery"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success(editing ? "Foto atualizada!" : "Foto criada! Faça o upload da imagem.")
      setDialogOpen(false)
      load()
    } catch {
      toast.error("Erro ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Foto removida.")
      load()
    } catch {
      toast.error("Erro ao remover.")
    } finally {
      setDeleteId(null)
    }
  }

  async function toggleActive(p: GalleryPhoto) {
    try {
      await fetch(`/api/gallery/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      })
      load()
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Espaço</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie a galeria de fotos do espaço exibida no site.
        </p>
      </div>

      {/* Conteúdo da seção */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Conteúdo da seção</CardTitle>
          </div>
          <CardDescription>
            Título e descrição opcionais exibidos no topo da seção Espaço.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="gallery_title">Título (opcional)</Label>
            <Input
              id="gallery_title"
              value={content.gallery_title}
              onChange={(e) => setContent((c) => ({ ...c, gallery_title: e.target.value }))}
              placeholder="Nosso Espaço"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gallery_description">Descrição (opcional)</Label>
            <Textarea
              id="gallery_description"
              value={content.gallery_description}
              onChange={(e) => setContent((c) => ({ ...c, gallery_description: e.target.value }))}
              rows={3}
              placeholder="Um ambiente pensado para o seu conforto e bem-estar."
            />
          </div>
          <div className="pt-1">
            <Button onClick={handleSaveContent} disabled={savingContent} className="gap-2">
              {savingContent ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              ) : (
                <><Save className="w-4 h-4" /> Salvar Conteúdo</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fotos */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Fotos</h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Exibidas em grade de 3 colunas no site, com visualização em tela cheia.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Foto
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : photos.length === 0 ? (
        <p className="text-sm text-muted-foreground bg-muted rounded-md px-4 py-6 text-center">
          Nenhuma foto cadastrada ainda. Clique em &ldquo;Nova Foto&rdquo; para começar.
        </p>
      ) : (
        <div className="space-y-3">
          {photos.map((p) => (
            <Card key={p.id} className={p.active ? "" : "opacity-60"}>
              <CardContent className="flex items-center gap-4 py-4">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />

                {/* Image preview */}
                <div className="w-14 h-14 rounded overflow-hidden bg-muted shrink-0">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-mono">
                      {String(p.order).padStart(2, "0")}
                    </span>
                    <p className="font-semibold text-sm truncate max-w-md">{p.alt}</p>
                    {!p.imageUrl && <Badge variant="outline">Sem imagem</Badge>}
                    {!p.active && <Badge variant="secondary">Oculta</Badge>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(p)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground"
                    title={p.active ? "Ocultar" : "Exibir"}
                  >
                    {p.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(p.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Foto" : "Nova Foto"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="alt">Descrição (alt)</Label>
                <Input
                  id="alt"
                  value={form.alt}
                  onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))}
                  placeholder="Espaço Carolina Dotti"
                />
                <p className="text-xs text-muted-foreground">
                  Texto alternativo para acessibilidade/SEO. Se vazio, usa
                  &ldquo;Espaço Carolina Dotti&rdquo;.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Ordem</Label>
                <Input
                  id="order"
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Image upload — só disponível ao editar (precisa do ID) */}
            {editing ? (
              <GalleryImageUpload
                photoId={editing.id}
                currentUrl={form.imageUrl || undefined}
                onSuccess={(url) => {
                  setForm((p) => ({ ...p, imageUrl: url }))
                  load()
                }}
              />
            ) : (
              <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                Salve a foto primeiro para fazer upload da imagem.
              </p>
            )}

            <div className="flex items-center gap-3">
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(v) => setForm((p) => ({ ...p, active: v }))}
              />
              <Label htmlFor="active">Exibir no site</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A foto será removida permanentemente.
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
