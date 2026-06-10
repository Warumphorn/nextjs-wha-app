import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import type { ApiResponse } from "@/types/api"
import type { TopProduct } from "@/types/admin-dashboard"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const topProductsRaw = await prisma.order_items.groupBy({
      by: ["product_id"],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    })

    const productIds = topProductsRaw.map((p) => p.product_id)
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    })
    const productNameMap = new Map(products.map((p) => [p.id, p.name ?? "ไม่ระบุ"]))

    const data: TopProduct[] = topProductsRaw.map((p) => ({
      id: p.product_id,
      name: productNameMap.get(p.product_id) ?? "ไม่ระบุ",
      soldCount: p._sum.quantity ?? 0,
      revenue: Number(p._sum.price ?? 0) * (p._sum.quantity ?? 0),
    }))

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<TopProduct[]>
    )
  } catch (err) {
    console.error("GET /api/admin/top-products error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
