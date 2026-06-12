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

interface AboutSettings {
  about_title: string
  about_text: string
  about_image: string
}

export default function AboutPage() {
  const [settings, setSettings] = useState<AboutSettings>({
    about_title: "",
    about_text: "",
    about_image: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          about_title: data.about_title ?? "",
          about_text: data.about_text ?? "",
          about_image: data.about_image ?? "",
        }))
        setLoading(false)
      })
      .catch(() => {
        toast.error("Erro ao carregar a seção Sobre")
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
          about_title: settings.about_title,
          about_text: settings.about_text,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Seção Sobre salva com sucesso!")
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
        <h2 className="text-2xl font-bold tracking-tight">Seção Sobre</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie o título, o texto e a imagem da seção &ldquo;Sobre&rdquo; do
          site.
        </p>
      </div>

      {/* Conteúdo (título + texto) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Conteúdo</CardTitle>
          </div>
          <CardDescription>
            O título e o texto exibidos ao lado da imagem na seção Sobre.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="about_title">Título</Label>
            <Textarea
              id="about_title"
              value={settings.about_title}
              onChange={(e) =>
                setSettings((p) => ({ ...p, about_title: e.target.value }))
              }
              rows={2}
              placeholder={"Um olhar que\nrevela beleza"}
            />
            <p className="text-xs text-muted-foreground">
              Use uma quebra de linha (Enter) para dividir o título em duas
              linhas, como no site.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about_text">Texto</Label>
            <Textarea
              id="about_text"
              value={settings.about_text}
              onChange={(e) =>
                setSettings((p) => ({ ...p, about_text: e.target.value }))
              }
              rows={10}
              placeholder="Escreva o texto da seção Sobre…"
            />
            <p className="text-xs text-muted-foreground">
              Separe os parágrafos com uma linha em branco (duas quebras de
              linha).
            </p>
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

      {/* Imagem */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Imagem</CardTitle>
          </div>
          <CardDescription>
            Faça upload e recorte da imagem exibida na seção Sobre. A imagem é
            otimizada automaticamente para WebP.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-xs">
          <ImageUpload
            type="about"
            label='Imagem "Sobre"'
            currentUrl={settings.about_image || undefined}
            aspect={3 / 4}
            onSuccess={(url) =>
              setSettings((prev) => ({ ...prev, about_image: url }))
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
