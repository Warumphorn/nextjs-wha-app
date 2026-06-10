"use client"

import dynamic from "next/dynamic"
import type { RevenuePoint } from "@/types/admin-dashboard"

const LineChartComponent = dynamic(
  () => import("recharts").then((mod) => {
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = mod

    function Chart({ data }: { data: RevenuePoint[] }) {
      if (data.length === 0) {
        return (
          <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
            ไม่มีข้อมูลรายได้ในช่วงเวลานี้
          </div>
        )
      }

      return (
        <ResponsiveContainer width="100%" height={288}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="text-xs text-muted-foreground"
              tickFormatter={(v: number) =>
                new Intl.NumberFormat("th-TH", {
                  notation: "compact",
                  currency: "THB",
                  style: "currency",
                }).format(v)
              }
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("th-TH", {
                  style: "currency",
                  currency: "THB",
                }).format(Number(value))
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }
    return Chart
  }),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
)

type RevenueChartProps = {
  data: RevenuePoint[]
  loading: boolean
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return <LineChartComponent data={data} />
}
