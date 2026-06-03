"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"

const services = [
  {
    id: "01",
    title: "Mechas",
    subtitle: "Luz e Dimensão",
    description:
      "Técnicas exclusivas de mechas que trazem luz natural e dimensão aos fios, criando movimento e luminosidade personalizados para cada tipo de cabelo.",
    image: "/images/service-mechas.jpg",
  },
  {
    id: "02",
    title: "Penteados",
    subtitle: "Gestos de Elegância",
    description:
      "Penteados artesanais que equilibram sofisticação e personalidade. Da noiva ao evento casual, cada criação é única e pensada para realçar sua beleza.",
    image: "/images/service-penteados.jpg",
  },
  {
    id: "03",
    title: "Maquiagem",
    subtitle: "Pele como Tela",
    description:
      "Maquiagem artística e profissional que valoriza seus traços naturais. Técnicas modernas para realçar sua beleza com leveza e elegância.",
    image: "/images/service-maquiagem.jpg",
  },
  {
    id: "04",
    title: "Coloração",
    subtitle: "A Cor Certa",
    description:
      "Coloração precisa e harmoniosa que respeita a saúde dos fios. Do tom natural ao ousado, encontramos juntas a cor que revela sua essência.",
    image: "/images/service-coloracao.jpg",
  },
  {
    id: "05",
    title: "Corte",
    subtitle: "Forma e Movimento",
    description:
      "Cortes que combinam técnica e sensibilidade, criando formas que valorizam seu rosto e se adaptam ao seu estilo de vida com leveza.",
    image: "/images/service-corte.jpg",
  },
  {
    id: "06",
    title: "Tratamentos",
    subtitle: "Saúde e Vitalidade",
    description:
      "Hidratação, nutrição e reconstrução capilar com produtos selecionados. Devolvemos a saúde e o brilho que seus fios merecem.",
    image: "/images/service-tratamentos.jpg",
  },
  {
    id: "07",
    title: "Escova",
    subtitle: "Fluidez Natural",
    description:
      "Escova modeladora que traz fluidez, brilho e movimento natural aos fios. O acabamento perfeito para qualquer ocasião.",
    image: "/images/service-escova.jpg",
  },
]

export default function Servicos() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section id="servicos" className="py-28 md:py-36 bg-[hsl(25_25%_89%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-4">
            O que fazemos
          </p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-[hsl(20_6%_18%)] leading-tight">
            Serviços
          </h2>
        </div>

        <div className="divide-y divide-[hsl(25_20%_82%)]">
          {services.map((service) => {
            const isOpen = openId === service.id
            return (
              <div key={service.id}>
                <button
                  onClick={() => toggle(service.id)}
                  className="w-full flex items-center justify-between py-7 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-8">
                    <span className="font-body text-xs tracking-widest text-[hsl(20_6%_40%)]">
                      {service.id}
                    </span>
                    <div>
                      <h3 className="font-display font-light text-2xl md:text-3xl text-[hsl(20_6%_18%)] group-hover:text-[hsl(30_35%_54%)] transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mt-1">
                        {service.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[hsl(30_35%_54%)] transition-transform duration-300">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    isOpen ? "max-h-[600px] opacity-100 pb-8" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 45vw"
                      />
                    </div>
                    <div className="flex flex-col justify-center md:py-8">
                      <div className="w-8 h-px bg-[hsl(30_35%_54%)] mb-6" />
                      <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed text-base">
                        {service.description}
                      </p>
                      <a
                        href="#contato"
                        className="inline-block mt-8 font-body text-xs tracking-[0.2em] uppercase text-[hsl(30_35%_54%)] border-b border-[hsl(30_35%_54%)] pb-0.5 w-fit hover:opacity-70 transition-opacity duration-300"
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
