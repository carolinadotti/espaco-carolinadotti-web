import type { Metadata } from "next"
import { Cormorant_Garamond, Montserrat } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
})

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
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  )
}
