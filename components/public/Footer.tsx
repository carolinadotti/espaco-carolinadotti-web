export default function Footer() {
  return (
    <footer className="py-10 bg-[hsl(20_6%_18%)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display font-light text-lg tracking-[0.15em] text-[hsl(30_33%_96%/0.8)]">
          Carolina Dotti
        </p>
        <p className="font-body text-xs text-[hsl(30_33%_96%/0.4)] tracking-wider">
          © {new Date().getFullYear()} Espaço Carolina Dotti. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
