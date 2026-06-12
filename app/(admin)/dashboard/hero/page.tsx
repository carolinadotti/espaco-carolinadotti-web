"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Image, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"

interface HeroSettings {
  hero_title: string
  hero_subtitle: string
  hero_image: string
  hero_image_mobile: string
}

export default function HeroPage() {
  const [settings, setSettings] = useState<HeroSettings>({
    hero_title: "",
    hero_subtitle: "",
    hero_image: "",
    hero_image_mobile: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          hero_title: data.hero_title ?? "",
          hero_subtitle: data.hero_subtitle ?? "",
          hero_image: data.hero_image ?? "",
          hero_image_mobile: data.hero_image_mobile ?? "",
        }))
        setLoading(false)
      })
      .catch(() => {
        toast.error("Erro ao carregar a seção Hero")
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Seção Hero salva com sucesso!")
    } catch {
      toast.error("Erro ao salvar. Tente novamente.")
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Seção Hero</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie o título, o subtítulo e as imagens da tela inicial do site.
        </p>
      </div>

      {/* Conteúdo (título + subtítulo) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Conteúdo</CardTitle>
          </div>
          <CardDescription>
            O título e o subtítulo exibidos sobre a imagem da tela inicial.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="hero_title">Título</Label>
            <Textarea
              id="hero_title"
              value={settings.hero_title}
              onChange={(e) =>
                setSettings((p) => ({ ...p, hero_title: e.target.value }))
              }
              rows={2}
              placeholder={"Carolina\nDotti"}
            />
            <p className="text-xs text-muted-foreground">
              Use uma quebra de linha (Enter) para dividir o título em duas
              linhas, como no site.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Subtítulo</Label>
            <Textarea
              id="hero_subtitle"
              value={settings.hero_subtitle}
              onChange={(e) =>
                setSettings((p) => ({ ...p, hero_subtitle: e.target.value }))
              }
              rows={2}
              placeholder="A beleza que já existe em você, revelada com elegância"
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Conteúdo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Imagens</CardTitle>
          </div>
          <CardDescription>
            Faça upload e recorte das imagens da tela inicial. As imagens são
            otimizadas automaticamente para WebP. Use a versão retrato para
            evitar cortes indesejados no celular.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 sm:grid-cols-2">
          <ImageUpload
            type="hero"
            label="Imagem Hero — Desktop (paisagem)"
            currentUrl={settings.hero_image || undefined}
            aspect={16 / 9}
            onSuccess={(url) =>
              setSettings((prev) => ({ ...prev, hero_image: url }))
            }
          />
          <ImageUpload
            type="hero_mobile"
            label="Imagem Hero — Mobile (retrato)"
            currentUrl={settings.hero_image_mobile || undefined}
            aspect={9 / 16}
            onSuccess={(url) =>
              setSettings((prev) => ({ ...prev, hero_image_mobile: url }))
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
