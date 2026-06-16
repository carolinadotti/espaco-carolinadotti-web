"use client"

import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import { Upload, Check, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Area { x: number; y: number; width: number; height: number }

interface ClientImageUploadProps {
  photoId: string
  currentUrl?: string
  onSuccess: (url: string) => void
}

async function cropImage(src: string, crop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("no ctx"))
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("empty"))), "image/jpeg", 0.95)
    }
    img.onerror = reject
  })
}

export default function ClientImageUpload({ photoId, currentUrl, onSuccess }: ClientImageUploadProps) {
  const [open, setOpen]     = useState(false)
  const [src, setSrc]       = useState<string | null>(null)
  const [crop, setCrop]     = useState({ x: 0, y: 0 })
  const [zoom, setZoom]     = useState(1)
  const [croppedArea, setCroppedArea] = useState<Area | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onCropComplete = useCallback((_: Area, pixels: Area) => setCroppedArea(pixels), [])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setSrc(reader.result as string); setOpen(true) }
    reader.readAsDataURL(file)
  }

  async function handleConfirm() {
    if (!src || !croppedArea) return
    setUploading(true)
    try {
      const blob = await cropImage(src, croppedArea)
      const fd = new FormData()
      fd.append("file", blob, "client.jpg")
      fd.append("type", `client-${photoId}`)
      const res = await fetch("/api/upload/image", { method: "POST", body: fd })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      onSuccess(url)
      toast.success("Imagem atualizada!")
      setOpen(false)
      setSrc(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch {
      toast.error("Erro no upload.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Foto</Label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-25 rounded overflow-hidden bg-muted border shrink-0" style={{ aspectRatio: "4 / 5" }}>
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()} className="gap-2">
          <Upload className="w-4 h-4" /> Selecionar imagem
        </Button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <p className="text-xs text-muted-foreground">Proporção 4:5 (retrato). Será convertida para WebP otimizado.</p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader><DialogTitle>Recortar foto do cliente</DialogTitle></DialogHeader>
          {src && (
            <div className="relative bg-black rounded overflow-hidden" style={{ height: 380 }}>
              <Cropper
                image={src} crop={crop} zoom={zoom} aspect={4 / 5}
                onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}
              />
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground shrink-0">Zoom</span>
            <input type="range" min={1} max={3} step={0.05} value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))} className="flex-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setSrc(null) }} disabled={uploading}>Cancelar</Button>
            <Button onClick={handleConfirm} disabled={uploading} className="gap-2">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Enviando…</> : <><Check className="w-4 h-4" />Confirmar</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
