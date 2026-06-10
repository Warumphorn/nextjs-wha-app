---
name: new-api-route
description: >
  Use this skill to scaffold and implement a new API route from scratch in
  this Next.js 16 App Router project. Triggers on: "add a new API endpoint",
  "create a route for products", "I need a POST endpoint", "scaffold an API",
  "add CRUD for X", or any step-by-step request to build a working API route
  with validation, Prisma, and auth. Walks through the full workflow from
  file creation to testing.
---

# Adding a New API Route — Step by Step

## Step 1: Create the File

```
src/app/api/<resource>/route.ts           # GET all, POST
src/app/api/<resource>/[id]/route.ts      # GET one, PUT, DELETE
```

ตัวอย่าง: เพิ่ม products API
```
src/app/api/products/route.ts
src/app/api/products/[id]/route.ts
```

## Step 2: Define Types in src/types/

```typescript
// src/types/product.ts
export type ProductResponse = {
  id: number
  name: string
  price: number
  categoryName: string
  imageName: string | null
}
```

## Step 3: Create Zod Schema in src/lib/validations/

```typescript
// src/lib/validations/product.ts
import { z } from "zod"

export const createProductSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  price: z.number().positive("ราคาต้องมากกว่า 0"),
  category_id: z.number().int(),
  description: z.string().optional(),
})

export const updateProductSchema = createProductSchema.partial()
```

## Step 4: Write the Route Handler

```typescript
// src/app/api/products/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createProductSchema } from "@/lib/validations/product"
import type { ProductResponse } from "@/types/product"

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
        product_images: { orderBy: { id: "asc" }, take: 1 },
      },
      orderBy: { id: "asc" },
    })

    const data: ProductResponse[] = products.map((p) => ({
      id: p.id,
      name: p.name ?? "ไม่ระบุ",
      price: Number(p.price ?? 0),
      categoryName: p.categories?.name ?? "ไม่ระบุหมวดหมู่",
      imageName: p.product_images[0]?.image_name ?? null,
    }))

    return NextResponse.json<ApiResponse<ProductResponse[]>>(
      { success: true, data },
      { status: 200 }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createProductSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "ข้อมูลไม่ถูกต้อง" },
        { status: 400 }
      )
    }

    const product = await prisma.products.create({ data: parsed.data })

    return NextResponse.json<ApiResponse<typeof product>>(
      { success: true, data: product },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    )
  }
}
```

## Step 5: Test with curl

```bash
# GET
curl http://localhost:3000/api/products

# POST
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"สินค้าทดสอบ","price":199,"category_id":1}'
```

## Checklist

- [ ] Types อยู่ใน `src/types/`
- [ ] Zod schema อยู่ใน `src/lib/validations/`
- [ ] ใช้ `prisma` singleton จาก `@/lib/prisma`
- [ ] `Decimal` แปลงเป็น `Number()` ก่อนส่ง response
- [ ] Response ใช้ pattern `{ success, data | error }`
- [ ] ชื่อไฟล์ validation เป็น kebab-case
- [ ] Protected route ใส่ session check (ถ้าต้องการ)
