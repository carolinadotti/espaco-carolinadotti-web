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
  title: {
    default: "Carolina Dotti — Beleza e Elegância",
    template: "%s | Espaço Carolina Dotti",
  },
  description:
    "Espaço de beleza especializado em mechas, coloração, penteados, maquiagem, corte e tratamentos capilares. Atendimento personalizado em São Lourenço do Sul, RS.",
  authors: [{ name: "Carolina Dotti" }],
  creator: "Carolina Dotti",
  publisher: "Espaço Carolina Dotti",
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
