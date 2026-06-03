"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#contato", label: "Contato" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[hsl(30_33%_96%/0.95)] backdrop-blur-md border-b border-[hsl(25_20%_82%)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        <a
          href="#inicio"
          className="font-display text-xl font-light tracking-[0.2em] uppercase text-[hsl(20_6%_18%)]"
        >
          Carolina Dotti
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-xs tracking-widest uppercase text-[hsl(20_6%_40%)] hover:text-[hsl(20_6%_18%)] transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="font-body text-xs tracking-widest uppercase px-6 py-2.5 border border-[hsl(30_35%_54%)] text-[hsl(30_35%_54%)] hover:bg-[hsl(30_35%_54%)] hover:text-[hsl(30_33%_96%)] transition-all duration-300"
          >
            Agendar
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-[hsl(20_6%_18%)]"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[hsl(30_33%_96%/0.97)] backdrop-blur-md border-t border-[hsl(25_20%_82%)] px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body text-xs tracking-widest uppercase text-[hsl(20_6%_40%)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setMobileOpen(false)}
            className="font-body text-xs tracking-widest uppercase px-6 py-2.5 border border-[hsl(30_35%_54%)] text-[hsl(30_35%_54%)] text-center"
          >
            Agendar
          </a>
        </div>
      )}
    </header>
  )
}
