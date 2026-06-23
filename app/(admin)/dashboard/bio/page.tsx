"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Plus, Pencil, Trash2, GripVertical,
  Loader2, Eye, EyeOff, Link2, User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"
import { BIO_ICONS, type BioIconName } from "@/lib/bio-icons"

interface BioLink {
  id: string
  order: number
  label: string
  url: string
  icon: string
  active: boolean
}

const EMPTY: Omit<BioLink, "id"> = {
  order: 0, label: "", url: "", icon: "", active: true,
}

export default function BioPage() {
  const [links, setLinks] = useState<BioLink[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<BioLink | null>(null)
  const [form, setForm] = useState<Omit<BioLink, "id">>(EMPTY)

  const [profile, setProfile] = useState({ bio_avatar: "", bio_title: "" })
  const [savingProfile, setSavingProfile] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/bio-links")
    setLinks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) =>
        setProfile({
          bio_avatar: data.bio_avatar ?? "",
          bio_title: data.bio_title ?? "",
        })
      )
      .catch(() => {})
  }, [load])

  async function handleSaveProfile() {
    setSavingProfile(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio_title: profile.bio_title }),
      })
      if (!res.ok) throw new Error()
      toast.success("Perfil salvo!")
    } catch {
      toast.error("Erro ao salvar. Tente novamente.")
    } finally {
      setSavingProfile(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm({ ...EMPTY, order: links.length + 1 })
    setDialogOpen(true)
  }

  function openEdit(link: BioLink) {
    setEditing(link)
    setForm({
      order: link.order,
      label: link.label,
      url: link.url,
      icon: link.icon,
      active: link.active,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.label.trim() || !form.url.trim()) {
      toast.error("Preencha label e URL.")
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/bio-links/${editing.id}` : "/api/bio-links"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erro ao salvar")
      }
      toast.success(editing ? "Link atualizado!" : "Link criado!")
      setDialogOpen(false)
      load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/bio-links/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Link removido.")
      load()
    } catch {
      toast.error("Erro ao remover.")
    } finally {
      setDeleteId(null)
    }
  }

  async function toggleActive(link: BioLink) {
    try {
      await fetch(`/api/bio-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !link.active }),
      })
      load()
    } catch {
      toast.error("Erro ao atualizar.")
    }
  }

  const selectedIcon = form.icon ? BIO_ICONS[form.icon as BioIconName] : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bio</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie a página de links em{" "}
          <a href="/bio" target="_blank" rel="noopener noreferrer" className="underline">
            /bio
          </a>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Perfil</CardTitle>
          </div>
          <CardDescription>
            Avatar e nome exibidos no topo da página Bio.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ImageUpload
            type="bio"
            label="Avatar / Logotipo"
            currentUrl={profile.bio_avatar || undefined}
            aspect={1}
            onSuccess={(url) => setProfile((p) => ({ ...p, bio_avatar: url }))}
          />
          <div className="space-y-2">
            <Label htmlFor="bio_title">Nome</Label>
            <Input
              id="bio_title"
              value={profile.bio_title}
              onChange={(e) => setProfile((p) => ({ ...p, bio_title: e.target.value }))}
              placeholder="Carolina Dotti"
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={savingProfile} className="gap-2">
            {savingProfile ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
            ) : (
              "Salvar perfil"
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Links</h3>
          <p className="text-muted-foreground text-sm">
            {links.length} {links.length === 1 ? "link" : "links"} cadastrados
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Adicionar link
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : links.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8 bg-muted rounded-md">
          Nenhum link cadastrado. Clique em &ldquo;Adicionar link&rdquo; para começar.
        </p>
      ) : (
        <div className="space-y-3">
          {links.map((link) => {
            const IconComp = link.icon ? BIO_ICONS[link.icon as BioIconName]?.icon : null
            return (
              <Card key={link.id} className={!link.active ? "opacity-60" : ""}>
                <CardContent className="flex items-center gap-4 py-4">
                  <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0">
                    {IconComp ? (
                      <IconComp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{link.label}</p>
                      {!link.active && <Badge variant="secondary">Oculto</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">#{link.order}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleActive(link)}
                      title={link.active ? "Ocultar" : "Exibir"}
                    >
                      {link.active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(link)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(link.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar link" : "Novo link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="Instagram"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={form.url}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://instagram.com/carolsdotti"
              />
            </div>
            <div className="space-y-2">
              <Label>Ícone (opcional)</Label>
              <Select
                value={form.icon || "none"}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, icon: !v || v === "none" ? "" : v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum">
                    {selectedIcon ? (
                      <span className="flex items-center gap-2">
                        <selectedIcon.icon className="w-4 h-4" />
                        {selectedIcon.label}
                      </span>
                    ) : (
                      "Nenhum"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {(Object.entries(BIO_ICONS) as [BioIconName, typeof BIO_ICONS[BioIconName]][]).map(
                    ([key, { icon: Icon, label }]) => (
                      <SelectItem key={key} value={key}>
                        <Icon className="w-4 h-4" />
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: parseInt(e.target.value, 10) || 0 }))
                }
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, active: checked }))}
              />
              <Label htmlFor="active">Visível na página</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover link?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
