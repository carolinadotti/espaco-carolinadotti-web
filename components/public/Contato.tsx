"use client"

import { MessageCircle, AtSign, MapPin } from "lucide-react"

interface ContatoProps {
  instagram: string
  whatsapp: string
  address: string
  mapsUrl: string
  title?: string
  description?: string
  ctaLabel?: string
}

const DEFAULT_TITLE = "Agende seu\nhorário"
const DEFAULT_DESCRIPTION =
  "Cada atendimento é uma experiência única e exclusiva. Entre em contato para encontrarmos o melhor horário para você."
const DEFAULT_CTA_LABEL = "Agendar via WhatsApp"

export default function Contato({
  instagram,
  whatsapp,
  address,
  mapsUrl,
  title,
  description,
  ctaLabel,
}: ContatoProps) {
  const waNumber = whatsapp.replace(/\D/g, "")
  const waLink = `https://wa.me/${waNumber}`
  const heading = title?.trim() || DEFAULT_TITLE
  const body = description?.trim() || DEFAULT_DESCRIPTION
  const buttonLabel = ctaLabel?.trim() || DEFAULT_CTA_LABEL

  const handleWhatsappClick = async () => {
    try {
      await fetch("/api/track/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
    } catch {
      // silently ignore tracking errors
    }
    window.open(waLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="contato" className="py-28 md:py-36 bg-[hsl(30_33%_96%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-6">
              Contato
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl text-[hsl(20_6%_18%)] mb-8 leading-tight whitespace-pre-line">
              {heading}
            </h2>
            <div className="w-12 h-px bg-[hsl(30_35%_54%)] mb-8" />
            <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed mb-12">
              {body}
            </p>

            <button
              onClick={handleWhatsappClick}
              className="flex items-center gap-3 font-body text-xs tracking-[0.2em] uppercase px-8 py-4 bg-[hsl(30_35%_54%)] text-[hsl(30_33%_96%)] hover:bg-[hsl(30_35%_46%)] transition-all duration-300 w-full justify-center md:w-auto"
            >
              <MessageCircle size={16} />
              {buttonLabel}
            </button>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-10">
            {/* Instagram */}
            <div className="flex items-start gap-5">
              <div className="mt-1 w-10 h-10 rounded-full border border-[hsl(25_20%_82%)] flex items-center justify-center shrink-0">
                <AtSign size={16} className="text-[hsl(30_35%_54%)]" />
              </div>
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-1">
                  Instagram
                </p>
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[hsl(20_6%_18%)] hover:text-[hsl(30_35%_54%)] transition-colors duration-300"
                >
                  @{instagram}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-5">
              <div className="mt-1 w-10 h-10 rounded-full border border-[hsl(25_20%_82%)] flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-[hsl(30_35%_54%)]" />
              </div>
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-1">
                  WhatsApp
                </p>
                <button
                  onClick={handleWhatsappClick}
                  className="font-body text-[hsl(20_6%_18%)] hover:text-[hsl(30_35%_54%)] transition-colors duration-300 text-left"
                >
                  {whatsapp}
                </button>
              </div>
            </div>

            {/* Endereço */}
            <div className="flex items-start gap-5">
              <div className="mt-1 w-10 h-10 rounded-full border border-[hsl(25_20%_82%)] flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-[hsl(30_35%_54%)]" />
              </div>
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-1">
                  Endereço
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-[hsl(20_6%_18%)] hover:text-[hsl(30_35%_54%)] transition-colors duration-300 leading-relaxed"
                >
                  {address}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
