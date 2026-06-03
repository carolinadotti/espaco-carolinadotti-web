import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/admin/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${inter.variable} admin-theme`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </ThemeProvider>
    </div>
  )
}
