"use client"

import {
  AreaChart,
  Area,
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

interface VisitsChartProps {
  data: ChartData[]
}

export default function VisitsChart({ data }: VisitsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(213 94% 46%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(213 94% 46%)" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          formatter={(value) => [Number(value), "Visitas"]}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="hsl(213 94% 46%)"
          strokeWidth={2}
          fill="url(#visitGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
