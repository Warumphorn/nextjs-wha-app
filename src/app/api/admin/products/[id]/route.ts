import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { ApiResponse } from "@/types/api"
import type { AdminProduct } from "@/types/admin"

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
    const productId = Number(id)

    const body = await request.json()
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0].message,
        } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const { name, description, price, categoryId } = result.data

    const existing = await prisma.products.findUnique({ where: { id: productId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }

    const product = await prisma.products.update({
      where: { id: productId },
      data: {
        name,
        description: description || null,
        price,
        category_id: Number(categoryId),
      },
      include: { categories: { select: { name: true } } },
    })

    const data: AdminProduct = {
      id: product.id,
      name: product.name ?? "",
      description: product.description,
      price: Number(product.price),
      categoryId: product.category_id,
      categoryName: product.categories?.name ?? null,
    }

    return NextResponse.json(
      { success: true, data } satisfies ApiResponse<AdminProduct>
    )
  } catch (err) {
    console.error("PUT /api/admin/products/[id] error:", err)
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
    const productId = Number(id)

    const existing = await prisma.products.findUnique({ where: { id: productId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" } satisfies ApiResponse<never>,
        { status: 404 }
      )
    }

    const orderCount = await prisma.order_items.count({
      where: { product_id: productId },
    })
    if (orderCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `ไม่สามารถลบสินค้าได้ เนื่องจากมีคำสั่งซื้อที่เกี่ยวข้อง ${orderCount} รายการ`,
        } satisfies ApiResponse<never>,
        { status: 409 }
      )
    }

    await prisma.products.delete({ where: { id: productId } })

    return NextResponse.json(
      { success: true, data: null } satisfies ApiResponse<null>
    )
  } catch (err) {
    console.error("DELETE /api/admin/products/[id] error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
