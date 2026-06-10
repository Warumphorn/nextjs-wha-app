import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { categorySchema } from "@/lib/validations/category"
import type { ApiResponse } from "@/types/api"
import type { AdminCategory } from "@/types/admin"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const { id } = await params
    const categoryId = Number(id)

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

    const existing = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } },
    })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหมวดหมู่" } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }

    const category = await prisma.categories.update({
      where: { id: categoryId },
      data: { name: result.data.name },
    })

    const data: AdminCategory = {
      id: category.id,
      name: category.name ?? "",
      productCount: existing._count.products,
    }

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<AdminCategory>
    )
  } catch (err) {
    console.error("PUT /api/admin/categories/[id] error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" } satisfies ApiResponse<never>,
        { status: 401 }
      )
    }

    const { id } = await params
    const categoryId = Number(id)

    const existing = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: { _count: { select: { products: true } } },
    })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบหมวดหมู่" } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }

    if (existing._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `ไม่สามารถลบหมวดหมู่ได้ เนื่องจากมีสินค้าที่เกี่ยวข้อง ${existing._count.products} รายการ`,
        } satisfies ApiResponse<never>,
        { status: 409 }
      )
    }

    await prisma.categories.delete({ where: { id: categoryId } })

    return NextResponse.json(
      { success: true, data: null } satisfies ApiResponse<null>
    )
  } catch (err) {
    console.error("DELETE /api/admin/categories/[id] error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
