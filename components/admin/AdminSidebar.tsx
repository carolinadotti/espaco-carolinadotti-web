"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Scissors,
  ExternalLink,
  Sparkles,
  BookOpen,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/about",
    label: "Sobre",
    icon: User,
  },
  {
    href: "/dashboard/services",
    label: "Serviços",
    icon: Sparkles,
  },
  {
    href: "/dashboard/blog",
    label: "Blog",
    icon: BookOpen,
  },
  {
    href: "/dashboard/settings",
    label: "Configurações",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  userEmail?: string
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "AD"

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <Scissors className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-foreground leading-none">
              Carolina Dotti
            </p>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    render={<Link href={item.href} />}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Site</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/" target="_blank" rel="noopener noreferrer" />}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Ver Site</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-sidebar-foreground truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 w-full text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors py-1.5 px-2 rounded hover:bg-sidebar-accent"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
