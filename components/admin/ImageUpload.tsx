"use client"

import { useState, useCallback, useRef } from "react"
import Cropper from "react-easy-crop"
import { Upload, Check, Loader2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import Image from "next/image"

interface Area {
  x: number
  y: number
  width: number
  height: number
}

interface ImageUploadProps {
  type: "hero" | "about"
  label: string
  currentUrl?: string
  aspect: number
  onSuccess: (url: string) => void
}

async function createCroppedImage(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas context unavailable"))

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas is empty"))
          resolve(blob)
        },
        "image/jpeg",
        0.95
      )
    }
    image.onerror = reject
  })
}

export default function ImageUpload({
  type,
  label,
  currentUrl,
  aspect,
  onSuccess,
}: ImageUploadProps) {
  const [open, setOpen] = useState(false)
  const [srcImage, setSrcImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setSrcImage(reader.result as string)
      setOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleConfirm = async () => {
    if (!srcImage || !croppedAreaPixels) return
    setUploading(true)

    try {
      const blob = await createCroppedImage(srcImage, croppedAreaPixels)
      const formData = new FormData()
      formData.append("file", blob, `${type}.jpg`)
      formData.append("type", type)

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Upload falhou")
      const data = await res.json()

      onSuccess(data.url)
      toast.success("Imagem atualizada com sucesso!")
      setOpen(false)
      setSrcImage(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch {
      toast.error("Erro ao fazer upload. Tente novamente.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Preview */}
      <div
        className="relative border-2 border-dashed border-border rounded-lg overflow-hidden bg-muted/30"
        style={{ aspectRatio: aspect > 1 ? "16/9" : "3/4", maxHeight: 240 }}
      >
        {currentUrl ? (
          <Image
            src={currentUrl}
            alt={label}
            fill
            className="object-cover"
            sizes="400px"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs">Nenhuma imagem</p>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="gap-2"
      >
        <Upload className="w-4 h-4" />
        Selecionar imagem
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Crop dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Recortar imagem — {label}</DialogTitle>
          </DialogHeader>

          {srcImage && (
            <div
              className="relative bg-black rounded-md overflow-hidden"
              style={{ height: 380 }}
            >
              <Cropper
                image={srcImage}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          <div className="flex items-center gap-3 px-1">
            <span className="text-xs text-muted-foreground shrink-0">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false)
                setSrcImage(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={uploading} className="gap-2">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar e Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
