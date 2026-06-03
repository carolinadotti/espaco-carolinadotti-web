import { prisma } from "@/lib/db"
import { getVisitsLast6Months, getWhatsappClicksLast6Months } from "@/lib/analytics"
import { Eye, MessageCircle, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import VisitsChart from "@/components/admin/VisitsChart"
import WhatsappChart from "@/components/admin/WhatsappChart"

export default async function DashboardPage() {
  const [totalVisits, totalWhatsapp, visitsData, whatsappData] =
    await Promise.all([
      prisma.visit.count(),
      prisma.whatsappClick.count(),
      getVisitsLast6Months(),
      getWhatsappClicksLast6Months(),
    ])

  const conversionRate =
    totalVisits > 0
      ? ((totalWhatsapp / totalVisits) * 100).toFixed(1)
      : "0.0"

  const visitsThisMonth = visitsData[visitsData.length - 1]?.count ?? 0
  const waThisMonth = whatsappData[whatsappData.length - 1]?.count ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Resumo de visitas e conversões do site.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitas</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVisits.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {visitsThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cliques WhatsApp</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalWhatsapp.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {waThisMonth} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Visitas que clicaram no WhatsApp
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visitas por Mês</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <VisitsChart data={visitsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliques no WhatsApp</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <WhatsappChart data={whatsappData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
