"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, AtSign, Phone, MapPin, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"

interface Settings {
  instagram: string
  whatsapp: string
  address: string
  maps_url: string
  hero_image: string
  about_image: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    instagram: "",
    whatsapp: "",
    address: "",
    maps_url: "",
    hero_image: "",
    about_image: "",
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
          instagram: settings.instagram,
          whatsapp: settings.whatsapp,
          address: settings.address,
          maps_url: settings.maps_url,
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
          Gerencie as informações exibidas no site.
        </p>
      </div>

      {/* Imagens */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Imagens</CardTitle>
          </div>
          <CardDescription>
            Faça upload e recorte das imagens principais do site. As imagens
            são otimizadas automaticamente para WebP.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 sm:grid-cols-2">
          <ImageUpload
            type="hero"
            label="Imagem Hero (Tela Inicial)"
            currentUrl={settings.hero_image || undefined}
            aspect={16 / 9}
            onSuccess={(url) =>
              setSettings((prev) => ({ ...prev, hero_image: url }))
            }
          />
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

      {/* Contato */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Informações de Contato</CardTitle>
          </div>
          <CardDescription>
            Essas informações são exibidas na seção de contato do site.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <AtSign className="w-3.5 h-3.5" />
              Instagram
            </Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                @
              </span>
              <Input
                id="instagram"
                value={settings.instagram}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    instagram: e.target.value,
                  }))
                }
                className="rounded-l-none"
                placeholder="carolsdotti"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  whatsapp: e.target.value,
                }))
              }
              placeholder="+55 53 8103-9103"
            />
            <p className="text-xs text-muted-foreground">
              Somente dígitos serão usados para o link wa.me (ex: +55 53
              91234-5678)
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              Endereço
            </Label>
            <Input
              id="address"
              value={settings.address}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
              placeholder="Av. Marechal Floriano, 214, Barrinha..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maps_url">Link Google Maps</Label>
            <Input
              id="maps_url"
              value={settings.maps_url}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  maps_url: e.target.value,
                }))
              }
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-muted-foreground">
              URL completa do Google Maps para o endereço.
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
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
