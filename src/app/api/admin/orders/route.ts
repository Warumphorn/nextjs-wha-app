import { connection, NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse } from "@/types/api"
import type { AdminOrderItem } from "@/types/admin-dashboard"

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
    const limit = Math.min(
      Math.max(1, Number(searchParams.get("limit")) || 10),
      50
    )

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        include: {
          customers: { select: { name: true } },
        },
        orderBy: { date: "desc" },
        take: limit,
      }),
      prisma.orders.count(),
    ])

    const mapped: AdminOrderItem[] = orders.map((o) => ({
      id: o.id,
      customer: o.customers?.name ?? "ไม่ระบุ",
      date: o.date?.toISOString() ?? new Date().toISOString(),
      status: o.status ?? "received",
      total: Number(o.total_amount ?? 0),
    }))

    return NextResponse.json(
      {
        success: true,
        data: { orders: mapped, total },
      } satisfies ApiResponse<{ orders: AdminOrderItem[]; total: number }>
    )
  } catch (err) {
    console.error("GET /api/admin/orders error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
