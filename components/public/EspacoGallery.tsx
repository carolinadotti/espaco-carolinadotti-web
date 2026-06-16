"use client"

import { useState } from "react"
import Image from "next/image"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface Photo {
  id: string
  alt: string
  imageUrl: string
}

interface EspacoGalleryProps {
  title?: string
  description?: string
  photos: Photo[]
}

export default function EspacoGallery({ title, description, photos }: EspacoGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  if (photos.length === 0) return null

  const markLoaded = (id: string) =>
    setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: true }))

  const slides = photos.map((p) => ({
    src: p.imageUrl,
    alt: p.alt || "Espaço Carolina Dotti",
  }))

  return (
    <section id="espaco" className="py-28 md:py-36 bg-[hsl(30_33%_96%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-6">
            Espaço
          </p>
          {title && (
            <h2 className="font-display font-light text-4xl md:text-5xl text-[hsl(20_6%_18%)] leading-tight whitespace-pre-line">
              {title}
            </h2>
          )}
          <div className="w-12 h-px bg-[hsl(30_35%_54%)] my-8" />
          {description && (
            <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((p, i) => {
            const altText = p.alt || "Espaço Carolina Dotti"
            const isLoaded = loaded[p.id]
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setIndex(i)
                  setOpen(true)
                }}
                className="group relative aspect-square overflow-hidden bg-[hsl(25_25%_89%)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(30_35%_54%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(30_33%_96%)]"
                aria-label={`Abrir foto: ${altText}`}
              >
                {/* Skeleton de carregamento */}
                {!isLoaded && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 animate-pulse bg-[hsl(25_25%_89%)]"
                  />
                )}
                <Image
                  src={p.imageUrl}
                  alt={altText}
                  fill
                  loading="lazy"
                  onLoad={() => markLoaded(p.id)}
                  onError={() => markLoaded(p.id)}
                  className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-[hsl(20_6%_18%/0)] transition-colors duration-300 group-hover:bg-[hsl(20_6%_18%/0.15)]" />
              </button>
            )
          })}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
      />
    </section>
  )
}
