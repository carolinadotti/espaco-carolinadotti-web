import { getBioIcon } from "@/lib/bio-icons"

interface BioLinkItem {
  id: string
  label: string
  url: string
  icon: string
}

interface BioPageProps {
  avatarUrl?: string
  title?: string
  links: BioLinkItem[]
}

function getLinkTarget(url: string): { target?: string; rel?: string } {
  if (/^(mailto:|tel:)/i.test(url)) return {}
  return { target: "_blank", rel: "noopener noreferrer" }
}

export default function BioPage({ avatarUrl, title, links }: BioPageProps) {
  return (
    <section className="min-h-screen bg-background flex flex-col items-center px-6 py-16 md:py-24">
      <div className="w-full max-w-md flex flex-col items-center">
        {avatarUrl && (
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarUrl}
              alt={title || "Avatar"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {title && (
          <h1 className="font-display font-light text-2xl md:text-3xl text-foreground text-center mb-10 tracking-wide">
            {title}
          </h1>
        )}

        {!title && avatarUrl && <div className="mb-10" />}

        {links.length === 0 ? (
          <p className="font-body font-light text-sm text-muted-foreground text-center">
            Em breve, novos links por aqui.
          </p>
        ) : (
          <div className="w-full flex flex-col gap-3">
            {links.map((link) => (
              <BioLinkButton key={link.id} link={link} />
            ))}
          </div>
        )}

        <a
          href="/"
          className="mt-16 font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          espacocarolinadotti.com.br
        </a>
      </div>
    </section>
  )
}

function BioLinkButton({ link }: { link: BioLinkItem }) {
  const Icon = link.icon ? getBioIcon(link.icon) : null
  const linkProps = getLinkTarget(link.url)

  return (
    <a
      href={link.url}
      {...linkProps}
      className="group flex items-center justify-center gap-3 w-full font-body text-xs tracking-widest uppercase px-6 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {link.label}
    </a>
  )
}
