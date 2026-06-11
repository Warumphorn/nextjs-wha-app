import { connection, NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"
import type { ApiResponse } from "@/types/api"
import type { AdminProduct } from "@/types/admin"

const PAGE_SIZE = 10

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
    const search = searchParams.get("search") ?? ""
    const page = Math.max(1, Number(searchParams.get("page")) || 1)

    const where = search
      ? { name: { contains: search } as const }
      : {}

    const [rawProducts, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: { categories: { select: { name: true } } },
        orderBy: { id: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.products.count({ where }),
    ])

    const products: AdminProduct[] = rawProducts.map((p) => ({
      id: p.id,
      name: p.name ?? "",
      description: p.description,
      price: Number(p.price),
      categoryId: p.category_id,
      categoryName: p.categories?.name ?? null,
    }))

    return NextResponse.json(
      { success: true, data: { products, total } } satisfies ApiResponse<{
        products: AdminProduct[]
        total: number
      }>
    )
  } catch (err) {
    console.error("GET /api/admin/products error:", err)
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

    const product = await prisma.products.create({
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
      { success: true, data } satisfies ApiResponse<AdminProduct>,
      { status: 201 }
    )
  } catch (err) {
    console.error("POST /api/admin/products error:", err)
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาด" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
