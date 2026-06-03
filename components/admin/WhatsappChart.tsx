"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ChartData {
  month: string
  count: number
}

interface WhatsappChartProps {
  data: ChartData[]
}

export default function WhatsappChart({ data }: WhatsappChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91% / 0.5)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "hsl(215 16% 47%)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "hsl(0 0% 100%)",
            border: "1px solid hsl(214 32% 91%)",
            borderRadius: "6px",
            fontSize: 12,
          }}
          labelStyle={{ fontWeight: 600 }}
          formatter={(value) => [Number(value), "Cliques"]}
        />
        <Bar
          dataKey="count"
          fill="hsl(142 71% 45%)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
