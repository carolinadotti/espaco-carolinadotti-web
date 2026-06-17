"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Photo {
  id: string
  title: string
  imageUrl: string
}

interface ClientesCarouselProps {
  title?: string
  description?: string
  photos: Photo[]
}

export default function ClientesCarousel({ title, description, photos }: ClientesCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  if (photos.length === 0) return null

  const markLoaded = (id: string) =>
    setLoaded((prev) => (prev[id] ? prev : { ...prev, [id]: true }))

  const scroll = (dir: "prev" | "next") => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>("[data-card]")
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8
    track.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" })
  }

  return (
    <section id="clientes" className="py-28 md:py-36 bg-[hsl(30_33%_96%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-14 md:mb-20">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-6">
            Clientes
          </p>
          {title && (
            <h2 className="font-display font-light text-4xl md:text-5xl text-[hsl(20_6%_18%)] mb-8 leading-tight whitespace-pre-line">
              {title}
            </h2>
          )}
          <div className="w-12 h-px bg-[hsl(30_35%_54%)] mb-8" />
          {description && (
            <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Carrossel */}
      <div className="relative max-w-7xl mx-auto">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 md:px-12 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((p) => {
            const isLoaded = loaded[p.id]
            return (
              <article
                key={p.id}
                data-card
                className="group relative shrink-0 snap-start overflow-hidden rounded-sm bg-[hsl(25_25%_89%)] w-[80%] sm:w-[45%] lg:w-[31%] aspect-4/5"
              >
                {!isLoaded && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 animate-pulse bg-[hsl(25_25%_89%)]"
                  />
                )}
                <Image
                  src={p.imageUrl}
                  alt={p.title || "Cliente Espaço Carolina Dotti"}
                  fill
                  loading="lazy"
                  onLoad={() => markLoaded(p.id)}
                  onError={() => markLoaded(p.id)}
                  className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 31vw"
                />
                {p.title && (
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[hsl(20_6%_18%/0.7)] via-[hsl(20_6%_18%/0.25)] to-transparent p-5 md:p-6">
                    <p className="font-display font-light text-lg md:text-xl text-[hsl(30_33%_96%)] leading-snug">
                      {p.title}
                    </p>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {/* Setas (desktop) */}
        <button
          type="button"
          onClick={() => scroll("prev")}
          aria-label="Foto anterior"
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full border border-[hsl(30_35%_54%)] bg-[hsl(30_33%_96%/0.85)] backdrop-blur text-[hsl(20_6%_18%)] transition-colors hover:bg-[hsl(30_35%_54%)] hover:text-[hsl(30_33%_96%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(30_35%_54%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(30_33%_96%)]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          aria-label="Próxima foto"
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full border border-[hsl(30_35%_54%)] bg-[hsl(30_33%_96%/0.85)] backdrop-blur text-[hsl(20_6%_18%)] transition-colors hover:bg-[hsl(30_35%_54%)] hover:text-[hsl(30_33%_96%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(30_35%_54%)] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(30_33%_96%)]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}
