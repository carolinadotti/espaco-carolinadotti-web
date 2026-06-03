"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface AdminHeaderProps {
  title: string
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <SidebarTrigger>
          <PanelLeft className="w-5 h-5" />
        </SidebarTrigger>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Alternar tema"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </Button>
    </header>
  )
}
