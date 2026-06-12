import Image from "next/image"

interface HeroProps {
  imageUrl?: string
  imageUrlMobile?: string
  title?: string
  subtitle?: string
}

const DEFAULT_TITLE = "Carolina\nDotti"
const DEFAULT_SUBTITLE = "A beleza que já existe em você, revelada com elegância"

export default function Hero({
  imageUrl,
  imageUrlMobile,
  title,
  subtitle,
}: HeroProps) {
  const fallback = "/images/hero-fallback.jpg"
  const desktopSrc = imageUrl || fallback
  const mobileSrc = imageUrlMobile || imageUrl || fallback
  const heading = title?.trim() || DEFAULT_TITLE
  const tagline = subtitle?.trim() || DEFAULT_SUBTITLE

  return (
    <section
      id="inicio"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {/* Mobile (retrato) */}
        <Image
          src={mobileSrc}
          alt="Espaço Carolina Dotti"
          fill
          priority
          quality={90}
          className="object-cover object-center md:hidden"
          sizes="100vw"
        />
        {/* Desktop (paisagem) */}
        <Image
          src={desktopSrc}
          alt="Espaço Carolina Dotti"
          fill
          priority
          quality={90}
          className="object-cover object-center hidden md:block"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(20_6%_18%/0.2)] via-transparent to-[hsl(20_6%_18%/0.4)]" />
      </div>

      {/* Content — bottom-left, igual ao Lovable */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-20 md:pb-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl text-[hsl(30_33%_96%)] tracking-wide leading-tight whitespace-pre-line">
            {heading}
          </h1>
          <p className="mt-6 font-body font-light text-sm md:text-base tracking-widest uppercase text-[hsl(30_33%_96%/0.8)] max-w-md">
            {tagline}
          </p>
        </div>
      </div>
    </section>
  )
}
