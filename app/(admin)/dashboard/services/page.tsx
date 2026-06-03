"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus, Pencil, Trash2, GripVertical,
  Loader2, Eye, EyeOff, Image,
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
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import ServiceImageUpload from "@/components/admin/ServiceImageUpload"

interface Service {
  id: string
  order: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  active: boolean
}

const EMPTY: Omit<Service, "id"> = {
  order: 0, title: "", subtitle: "", description: "", imageUrl: "", active: true,
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState<Omit<Service, "id">>(EMPTY)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/services")
    setServices(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY, order: services.length + 1 })
    setDialogOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setForm({ order: s.order, title: s.title, subtitle: s.subtitle, description: s.description, imageUrl: s.imageUrl, active: s.active })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.title || !form.subtitle || !form.description) {
      toast.error("Preencha título, subtítulo e descrição.")
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/services/${editing.id}` : "/api/services"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success(editing ? "Serviço atualizado!" : "Serviço criado!")
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
      const res = await fetch(`/api/services/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Serviço removido.")
      load()
    } catch {
      toast.error("Erro ao remover.")
    } finally {
      setDeleteId(null)
    }
  }

  async function toggleActive(s: Service) {
    try {
      await fetch(`/api/services/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !s.active }),
      })
      load()
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Serviços</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os serviços exibidos no acordeão do site.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Serviço
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((s) => (
            <Card key={s.id} className={s.active ? "" : "opacity-60"}>
              <CardContent className="flex items-center gap-4 py-4">
                <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />

                {/* Image preview */}
                <div className="w-12 h-14 rounded overflow-hidden bg-muted shrink-0">
                  {s.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground font-mono">
                      {String(s.order).padStart(2, "0")}
                    </span>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <span className="text-xs text-muted-foreground">{s.subtitle}</span>
                    {!s.active && <Badge variant="secondary">Oculto</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-md">
                    {s.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(s)}
                    className="p-1.5 rounded text-muted-foreground hover:text-foreground"
                    title={s.active ? "Ocultar" : "Exibir"}
                  >
                    {s.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(s.id)}
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
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Mechas"
                />
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

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo *</Label>
              <Input
                id="subtitle"
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Luz e Dimensão"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                placeholder="Descreva o serviço..."
              />
            </div>

            {/* Image upload — só disponível ao editar (precisa do ID) */}
            {editing ? (
              <ServiceImageUpload
                serviceId={editing.id}
                currentUrl={form.imageUrl || undefined}
                onSuccess={(url) => {
                  setForm((p) => ({ ...p, imageUrl: url }))
                  // Atualiza lista em background
                  load()
                }}
              />
            ) : (
              <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
                Salve o serviço primeiro para fazer upload da imagem.
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
            <AlertDialogTitle>Remover serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço será removido permanentemente.
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
