"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Type, Phone, AtSign, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

interface ContactSettings {
  contact_title: string
  contact_description: string
  contact_cta_label: string
  instagram: string
  whatsapp: string
  address: string
  maps_url: string
}

export default function ContactPage() {
  const [settings, setSettings] = useState<ContactSettings>({
    contact_title: "",
    contact_description: "",
    contact_cta_label: "",
    instagram: "",
    whatsapp: "",
    address: "",
    maps_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [savingContent, setSavingContent] = useState(false)
  const [savingInfo, setSavingInfo] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({
          ...prev,
          contact_title: data.contact_title ?? "",
          contact_description: data.contact_description ?? "",
          contact_cta_label: data.contact_cta_label ?? "",
          instagram: data.instagram ?? "",
          whatsapp: data.whatsapp ?? "",
          address: data.address ?? "",
          maps_url: data.maps_url ?? "",
        }))
        setLoading(false)
      })
      .catch(() => {
        toast.error("Erro ao carregar a seção Contato")
        setLoading(false)
      })
  }, [])

  async function save(
    payload: Record<string, string>,
    setBusy: (v: boolean) => void
  ) {
    setBusy(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      toast.success("Alterações salvas com sucesso!")
    } catch {
      toast.error("Erro ao salvar. Tente novamente.")
    } finally {
      setBusy(false)
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
        <h2 className="text-2xl font-bold tracking-tight">Seção Contato</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Gerencie os textos e as informações de contato exibidos no site.
        </p>
      </div>

      {/* Conteúdo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">Conteúdo</CardTitle>
          </div>
          <CardDescription>
            Título, descrição e texto do botão da seção Contato.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="contact_title">Título</Label>
            <Textarea
              id="contact_title"
              value={settings.contact_title}
              onChange={(e) =>
                setSettings((p) => ({ ...p, contact_title: e.target.value }))
              }
              rows={2}
              placeholder={"Agende seu\nhorário"}
            />
            <p className="text-xs text-muted-foreground">
              Use uma quebra de linha (Enter) para dividir o título em duas
              linhas, como no site.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_description">Descrição</Label>
            <Textarea
              id="contact_description"
              value={settings.contact_description}
              onChange={(e) =>
                setSettings((p) => ({
                  ...p,
                  contact_description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Cada atendimento é uma experiência única e exclusiva…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_cta_label">Texto do botão (CTA)</Label>
            <Input
              id="contact_cta_label"
              value={settings.contact_cta_label}
              onChange={(e) =>
                setSettings((p) => ({ ...p, contact_cta_label: e.target.value }))
              }
              placeholder="Agendar via WhatsApp"
            />
          </div>

          <div className="pt-1">
            <Button
              onClick={() =>
                save(
                  {
                    contact_title: settings.contact_title,
                    contact_description: settings.contact_description,
                    contact_cta_label: settings.contact_cta_label,
                  },
                  setSavingContent
                )
              }
              disabled={savingContent}
              className="gap-2"
            >
              {savingContent ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              ) : (
                <><Save className="w-4 h-4" /> Salvar Conteúdo</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Contato */}
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
                  setSettings((prev) => ({ ...prev, instagram: e.target.value }))
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
                setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))
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
                setSettings((prev) => ({ ...prev, address: e.target.value }))
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
                setSettings((prev) => ({ ...prev, maps_url: e.target.value }))
              }
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-muted-foreground">
              URL completa do Google Maps para o endereço.
            </p>
          </div>

          <div className="pt-1">
            <Button
              onClick={() =>
                save(
                  {
                    instagram: settings.instagram,
                    whatsapp: settings.whatsapp,
                    address: settings.address,
                    maps_url: settings.maps_url,
                  },
                  setSavingInfo
                )
              }
              disabled={savingInfo}
              className="gap-2"
            >
              {savingInfo ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando…</>
              ) : (
                <><Save className="w-4 h-4" /> Salvar Informações</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
