"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface Settings {
  site_title: string
  site_description: string
  site_keywords: string
  og_image: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    site_title: "",
    site_description: "",
    site_keywords: "",
    og_image: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }))
        setLoading(false)
      })
      .catch(() => {
        toast.error("Erro ao carregar configurações")
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
          site_title: settings.site_title,
          site_description: settings.site_description,
          site_keywords: settings.site_keywords,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Configurações salvas com sucesso!")
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
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie o SEO e as metatags do site.
        </p>
      </div>

      {/* SEO */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">SEO &amp; Metatags</CardTitle>
          </div>
          <CardDescription>
            Informações exibidas nos resultados de busca (Google) e ao
            compartilhar o site nas redes sociais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="site_title">Título do Site</Label>
            <Input
              id="site_title"
              value={settings.site_title}
              onChange={(e) =>
                setSettings((p) => ({ ...p, site_title: e.target.value }))
              }
              placeholder="Carolina Dotti — Beleza e Elegância"
              maxLength={70}
            />
            <p className="text-xs text-muted-foreground">
              Ideal: até 60 caracteres.{" "}
              <span
                className={
                  settings.site_title.length > 60
                    ? "text-destructive font-medium"
                    : ""
                }
              >
                {settings.site_title.length}/60
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Descrição</Label>
            <Textarea
              id="site_description"
              value={settings.site_description}
              onChange={(e) =>
                setSettings((p) => ({ ...p, site_description: e.target.value }))
              }
              rows={3}
              placeholder="Espaço de beleza especializado em mechas, coloração..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              Ideal: entre 120 e 160 caracteres.{" "}
              <span
                className={
                  settings.site_description.length > 160
                    ? "text-destructive font-medium"
                    : settings.site_description.length < 120 &&
                        settings.site_description.length > 0
                      ? "text-amber-500 font-medium"
                      : ""
                }
              >
                {settings.site_description.length}/160
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_keywords">Palavras-chave</Label>
            <Input
              id="site_keywords"
              value={settings.site_keywords}
              onChange={(e) =>
                setSettings((p) => ({ ...p, site_keywords: e.target.value }))
              }
              placeholder="salão de beleza, mechas, coloração, São Lourenço do Sul"
            />
            <p className="text-xs text-muted-foreground">
              Separe por vírgula. Foque em termos que seu cliente usaria para
              encontrar o salão.
            </p>
          </div>

          {/* Preview simulado */}
          {(settings.site_title || settings.site_description) && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Preview no Google
              </p>
              <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-base font-medium leading-snug line-clamp-1">
                {settings.site_title || "Título do site"}
              </p>
              <p className="text-[#006621] dark:text-[#34a853] text-xs">
                espacocarolinadotti.com.br
              </p>
              <p className="text-[#545454] dark:text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                {settings.site_description || "Descrição do site..."}
              </p>
            </div>
          )}

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
                  Salvar SEO
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
