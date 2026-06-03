import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Carolina Dotti — Beleza e Elegância",
  description:
    "Salão especializado em mechas, penteados, maquiagem, corte, coloração e tratamentos capilares. Espaço Carolina Dotti em São Lourenço do Sul, RS.",
  openGraph: {
    title: "Carolina Dotti — Beleza e Elegância",
    description:
      "Salão especializado em mechas, penteados, maquiagem, corte, coloração e tratamentos capilares.",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
