import Image from "next/image"

interface SobreProps {
  imageUrl?: string
  title?: string
  text?: string
}

const DEFAULT_TITLE = "Um olhar que\nrevela beleza"
const DEFAULT_TEXT =
  "Cada pessoa carrega consigo uma beleza singular, muitas vezes adormecida sob a rotina do cotidiano. Meu trabalho é criar um espaço onde essa beleza possa respirar e se revelar naturalmente.\n\nCom anos de dedicação e uma busca constante pela excelência, desenvolvi uma abordagem que valoriza a individualidade de cada cliente. Não transformo — revelo. Não imponho — escuto. O resultado é uma versão sua que você reconhece como a mais autêntica."

export default function Sobre({ imageUrl, title, text }: SobreProps) {
  const src = imageUrl || "/images/about-fallback.jpg"
  const heading = title?.trim() || DEFAULT_TITLE
  const body = text?.trim() || DEFAULT_TEXT
  const paragraphs = body.split(/\n{2,}/).filter((p) => p.trim().length > 0)

  return (
    <section id="sobre" className="py-28 md:py-36 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-0 items-center">
          {/* Image */}
          <div className="md:col-span-5 md:col-start-1">
            <div className="relative aspect-3/4 overflow-hidden">
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
            <h2 className="font-display font-light text-4xl md:text-5xl text-[hsl(20_6%_18%)] mb-8 leading-tight whitespace-pre-line">
              {heading}
            </h2>
            <div className="w-12 h-px bg-[hsl(30_35%_54%)] mb-8" />
            {paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`font-body font-light text-[hsl(20_6%_40%)] leading-relaxed ${
                  i < paragraphs.length - 1 ? "mb-5" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
