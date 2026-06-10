import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse } from "@/types/api"
import type { AdminStats, OrderStatusCount } from "@/types/admin-dashboard"

const STATUS_LABELS: Record<string, string> = {
  received: "รับแล้ว",
  processing: "กำลังดำเนินการ",
  delivered: "จัดส่งแล้ว",
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const endOfToday = new Date()
    endOfToday.setHours(23, 59, 59, 999)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    const endOfMonth = new Date()
    endOfMonth.setHours(23, 59, 59, 999)

    const [
      todayOrdersResult,
      pendingOrders,
      totalProducts,
      totalUsers,
      allOrders,
      monthlyOrdersResult,
    ] = await Promise.all([
      prisma.orders.aggregate({
        _sum: { total_amount: true },
        _count: { id: true },
        where: {
          date: { gte: startOfToday, lte: endOfToday },
        },
      }),
      prisma.orders.count({
        where: { status: { in: ["received", "processing"] } },
      }),
      prisma.products.count(),
      prisma.user.count(),
      prisma.orders.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { status: { not: null } },
      }),
      prisma.orders.aggregate({
        _sum: { total_amount: true },
        _count: { id: true },
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
        },
      }),
    ])

    const orderStatusBreakdown: OrderStatusCount[] = allOrders.map((g) => ({
      status: g.status ?? "unknown",
      count: g._count.id,
      label: STATUS_LABELS[g.status ?? ""] ?? g.status ?? "ไม่ระบุ",
    }))

    const data: AdminStats = {
      todaySales: Number(todayOrdersResult._sum.total_amount ?? 0),
      todayOrders: todayOrdersResult._count.id,
      pendingOrders,
      totalProducts,
      totalUsers,
      orderStatusBreakdown,
      monthlyRevenue: Number(monthlyOrdersResult._sum.total_amount ?? 0),
      monthlyOrders: monthlyOrdersResult._count.id,
    }

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<AdminStats>
    )
  } catch (err) {
    console.error("GET /api/admin/stats error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
