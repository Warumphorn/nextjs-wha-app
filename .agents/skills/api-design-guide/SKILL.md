---
name: api-design-guide
description: >
  Use this skill when designing or creating new API routes in this Next.js 16
  App Router project. Triggers on: "add an API endpoint", "create a route
  handler", "design an API for X", "how should I structure this API", or any
  request to build server-side API logic. Covers response format, validation
  with Zod, error handling, HTTP method conventions, and Prisma integration
  patterns specific to this codebase.
---

# API Route Design Guide

## File Location

```
src/app/api/<resource>/route.ts          # collection: GET list, POST create
src/app/api/<resource>/[id]/route.ts     # item: GET one, PUT update, DELETE
```

## Response Envelope Pattern

ทุก API route ในโปรเจกต์นี้ใช้ pattern เดียวกัน — ใช้ให้สอดคล้อง:

```typescript
type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

```typescript
// Success
return NextResponse.json<ApiResponse<Product>>(
  { success: true, data: product },
  { status: 200 }
)

// Validation error
return NextResponse.json<ApiResponse<never>>(
  { success: false, error: "ข้อมูลไม่ถูกต้อง" },
  { status: 400 }
)

// Server error
return NextResponse.json<ApiResponse<never>>(
  { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
  { status: 500 }
)
```

## Route Handler Template

```typescript
import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  category_id: z.number().int(),
})

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

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
      { success: false, error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 }
    )
  }
}
```

## Prisma in API Routes

- ใช้ singleton `prisma` จาก `@/lib/prisma` — ไม่สร้าง `PrismaClient` ใหม่
- `Decimal` field (price, total_amount) ต้องแปลงก่อนส่ง: `Number(product.price)`
- Model ชื่อ snake_case: `prisma.products`, `prisma.order_items`, `prisma.categories`

## HTTP Status Codes

| สถานการณ์         | Status |
|-------------------|--------|
| GET สำเร็จ        | 200    |
| POST สร้างสำเร็จ  | 201    |
| Validation fail   | 400    |
| ไม่ได้ login      | 401    |
| ไม่มีสิทธิ์       | 403    |
| ไม่พบข้อมูล       | 404    |
| Server error      | 500    |

## Auth Check in API Routes

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({ headers: await headers() })
if (!session) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: "กรุณาเข้าสู่ระบบ" },
    { status: 401 }
  )
}
```

## Gotchas

- `catch {}` ไม่ต้องรับ error variable ถ้าไม่ใช้ — Next.js 16 / TS 5 รองรับแล้ว
- ไม่ต้อง `export const runtime = "edge"` — ใช้ default Node.js runtime
- Route ใหม่ต้องอยู่ใน `src/app/api/` ไม่ใช่ `src/pages/api/` (App Router เท่านั้น)
- TypeScript Type ของ request/response body ให้แยกไว้ใน `src/types/`
