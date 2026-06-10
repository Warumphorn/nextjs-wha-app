import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { categorySchema } from "@/lib/validations/category"
import type { ApiResponse } from "@/types/api"
import type { AdminCategory } from "@/types/admin"

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const categories = await prisma.categories.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    })

    const data: AdminCategory[] = categories.map((c) => ({
      id: c.id,
      name: c.name ?? "",
      productCount: c._count.products,
    }))

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<AdminCategory[]>
    )
  } catch (err) {
    console.error("GET /api/admin/categories error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const body = await request.json()
    const result = categorySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0].message,
        } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const category = await prisma.categories.create({
      data: { name: result.data.name },
    })

    const data: AdminCategory = {
      id: category.id,
      name: category.name ?? "",
      productCount: 0,
    }

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<AdminCategory>,
      { status: 201 }
    )
  } catch (err) {
    console.error("POST /api/admin/categories error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
