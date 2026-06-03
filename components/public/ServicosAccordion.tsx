"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"

interface ServiceItem {
  id: string
  order: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
}

interface ServicosAccordionProps {
  services: ServiceItem[]
}

export default function ServicosAccordion({ services }: ServicosAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  if (services.length === 0) return null

  return (
    <section id="servicos" className="py-28 md:py-36 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Serviços
          </p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-foreground leading-tight">
            Cada detalhe,<br />uma intenção
          </h2>
        </div>

        <div className="divide-y divide-border">
          {services.map((service) => {
            const isOpen = openId === service.id
            const num = String(service.order).padStart(2, "0")
            const hasImage = !!service.imageUrl

            return (
              <div key={service.id}>
                <button
                  onClick={() => toggle(service.id)}
                  className="w-full flex items-center justify-between py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-8">
                    <span className="font-body text-xs tracking-widest text-muted-foreground">
                      {num}
                    </span>
                    <div>
                      <h3 className="font-display font-light text-2xl md:text-3xl text-foreground group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-1">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-primary transition-transform duration-300">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-[600px] opacity-100 pb-8" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className={`grid gap-8 items-start ${hasImage ? "md:grid-cols-2" : ""}`}>
                    {hasImage && (
                      <div className="relative aspect-4/5 overflow-hidden">
                        <Image
                          src={service.imageUrl}
                          alt={service.title}
                          fill
                          className="object-cover object-center"
                          sizes="(max-width: 768px) 100vw, 45vw"
                        />
                      </div>
                    )}
                    <div className={`flex flex-col justify-center ${hasImage ? "md:py-8" : "py-4"}`}>
                      <div className="w-8 h-px bg-primary mb-6" />
                      <p className="font-body font-light text-muted-foreground leading-relaxed text-base">
                        {service.description}
                      </p>
                      <a
                        href="#contato"
                        className="inline-block mt-8 font-body text-xs tracking-[0.2em] uppercase text-primary border-b border-primary pb-0.5 w-fit hover:opacity-70 transition-opacity duration-300"
                      >
                        Agendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
