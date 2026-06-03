import Image from "next/image"

interface HeroProps {
  imageUrl?: string
}

export default function Hero({ imageUrl }: HeroProps) {
  const src = imageUrl || "/images/hero-fallback.jpg"

  return (
    <section
      id="inicio"
      className="relative h-screen w-full overflow-hidden"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(20_6%_18%/0.2)] via-transparent to-[hsl(20_6%_18%/0.4)]" />
      </div>

      {/* Content — bottom-left, igual ao Lovable */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-20 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl text-[hsl(30_33%_96%)] tracking-wide leading-tight">
            Carolina<br />Dotti
          </h1>
          <p className="mt-6 font-body font-light text-sm md:text-base tracking-widest uppercase text-[hsl(30_33%_96%/0.8)] max-w-md">
            A beleza que já existe em você, revelada com elegância
          </p>
        </div>
      </div>
    </section>
  )
}
