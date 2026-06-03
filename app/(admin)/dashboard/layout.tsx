import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <SidebarProvider>
      <AdminSidebar userEmail={session.user?.email ?? undefined} />
      <SidebarInset>
        <AdminHeader title="Espaço Carolina Dotti" />
        <main className="flex-1 p-6 bg-background min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
