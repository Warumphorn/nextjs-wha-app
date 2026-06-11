import { connection, NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse } from "@/types/api"
import type { RevenuePoint, Period } from "@/types/admin-dashboard"

function getPeriodDates(period: Period): { start: Date; end: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
  start.setDate(start.getDate() - days + 1)

  return { start, end }
}

export async function GET(request: NextRequest) {
  await connection()
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const { searchParams } = request.nextUrl
    const period = (searchParams.get("period") ?? "30d") as Period

    const { start, end } = getPeriodDates(period)

    const orders = await prisma.orders.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        date: true,
        total_amount: true,
      },
      orderBy: { date: "asc" },
    })

    const revenueMap = new Map<string, { revenue: number; orders: number }>()

    // Generate all dates in range
    const current = new Date(start)
    while (current <= end) {
      const key = current.toISOString().slice(0, 10)
      revenueMap.set(key, { revenue: 0, orders: 0 })
      current.setDate(current.getDate() + 1)
    }

    for (const order of orders) {
      if (!order.date) continue
      const key = order.date.toISOString().slice(0, 10)
      const entry = revenueMap.get(key)
      if (entry) {
        entry.revenue += Number(order.total_amount ?? 0)
        entry.orders += 1
      }
    }

    const data: RevenuePoint[] = Array.from(revenueMap.entries()).map(
      ([date, val]) => ({
        date,
        revenue: Math.round(val.revenue * 100) / 100,
        orders: val.orders,
      })
    )

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<RevenuePoint[]>
    )
  } catch (err) {
    console.error("GET /api/admin/revenue error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
