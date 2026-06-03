import Image from "next/image"

interface SobreProps {
  imageUrl?: string
}

export default function Sobre({ imageUrl }: SobreProps) {
  const src = imageUrl || "/images/about-fallback.jpg"

  return (
    <section id="sobre" className="py-28 md:py-36 bg-[hsl(30_33%_96%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-0 items-center">
          {/* Image */}
          <div className="md:col-span-5 md:col-start-1">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={src}
                alt="Carolina Dotti"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Text */}
          <div className="md:col-span-5 md:col-start-7 flex flex-col justify-center">
            <p className="font-body text-xs tracking-[0.3em] uppercase text-[hsl(20_6%_40%)] mb-6">
              Sobre
            </p>
            <h2 className="font-display font-light text-4xl md:text-5xl text-[hsl(20_6%_18%)] mb-8 leading-tight">
              Um olhar que revela beleza
            </h2>
            <div className="w-12 h-px bg-[hsl(30_35%_54%)] mb-8" />
            <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed mb-5">
              Com anos de experiência e uma paixão genuína pelo que faz, Carolina
              Dotti construiu um espaço onde cada cliente é tratada com atenção e
              cuidado únicos.
            </p>
            <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed mb-5">
              Especializada em coloração, mechas e penteados, Carolina acredita
              que a beleza é uma expressão pessoal — e seu papel é ajudar cada
              mulher a encontrar a sua.
            </p>
            <p className="font-body font-light text-[hsl(20_6%_40%)] leading-relaxed">
              Em São Lourenço do Sul, o Espaço Carolina Dotti tornou-se
              referência em beleza e elegância para quem busca sofisticação e
              atendimento personalizado.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
