import Image from "next/image"

interface HeroProps {
  imageUrl?: string
}

export default function Hero({ imageUrl }: HeroProps) {
  const src = imageUrl || "/images/hero-fallback.jpg"

  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt="Espaço Carolina Dotti"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(20_6%_18%/0.2)] to-[hsl(20_6%_18%/0.45)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-fade-in">
        <p className="font-body text-xs tracking-[0.4em] uppercase text-[hsl(30_33%_96%/0.8)] mb-6">
          Espaço de Beleza
        </p>
        <h1 className="font-display font-light text-6xl md:text-8xl text-[hsl(30_33%_96%)] mb-6 leading-none">
          Carolina Dotti
        </h1>
        <p className="font-display italic font-light text-xl md:text-2xl text-[hsl(30_33%_96%/0.85)] mb-10">
          Beleza e Elegância
        </p>
        <a
          href="#sobre"
          className="inline-block font-body text-xs tracking-[0.3em] uppercase px-8 py-3.5 border border-[hsl(30_33%_96%/0.6)] text-[hsl(30_33%_96%)] hover:bg-[hsl(30_33%_96%/0.15)] transition-all duration-500"
        >
          Conheça o Espaço
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
        <div className="w-px h-12 bg-[hsl(30_33%_96%/0.4)]" />
        <p className="font-body text-[10px] tracking-widest uppercase text-[hsl(30_33%_96%/0.5)]">
          Scroll
        </p>
      </div>
    </section>
  )
}
