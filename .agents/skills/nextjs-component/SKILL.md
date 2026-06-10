---
name: nextjs-component
description: >
  Use this skill when creating or modifying React components in this Next.js
  16 project. Triggers on: "create a component", "add a page", "make this
  interactive", "add a loading state", "Server Component vs Client Component",
  "where should this component go", or any request to build UI. Covers the
  Server/Client boundary, Suspense patterns, layout constraints, and file
  placement rules specific to this codebase.
---

# Next.js 16 Component Guide

## Server Component vs Client Component

### Server Component (default — ไม่ต้อง declare)

ใช้เมื่อ:
- ดึงข้อมูลจาก DB หรือ external API
- ไม่ต้องการ interactivity (ไม่มี onClick, onChange)
- ต้องการ SEO หรือ metadata

```typescript
// src/app/(front)/product/page.tsx — Server Component
import prisma from "@/lib/prisma"

export default async function ProductPage() {
  const products = await prisma.products.findMany({ ... })
  return <FeaturesProduct products={serializedProducts} />
}
```

### Client Component — ต้องใส่ `"use client"`

ใช้เมื่อ:
- ใช้ `useState`, `useEffect`, `useRef`
- ใช้ event handlers (onClick, onChange)
- ใช้ browser API หรือ Zustand store

```typescript
"use client"
// src/app/(front)/components/CartButton.tsx
import { useCartStore } from "@/lib/cart-store"

export function CartButton() {
  const addItem = useCartStore((s) => s.addItem)
  return <button onClick={() => addItem(...)}>เพิ่มลงตะกร้า</button>
}
```

## Component Placement Rules

| ประเภท                          | ที่วาง                                    |
|---------------------------------|-------------------------------------------|
| Shared across routes            | `src/components/`                         |
| Shadcn / base UI primitive      | `src/components/ui/`                      |
| ใช้เฉพาะใน (front) pages        | `src/app/(front)/components/`             |
| Page component                  | `src/app/(front)/<page>/page.tsx`         |
| Loading skeleton                | `src/app/(front)/<page>/loading.tsx`      |

## Layout Rules (Critical)

ห้ามสร้าง `src/app/layout.tsx` — โปรเจกต์นี้ใช้ **สอง root layouts แยกกัน**:

- `(front)/layout.tsx` → มี `<html lang="th">`, `<body>`, `<Navbar />`
- `(auth)/layout.tsx` → มี `<html lang="th">`, `<body>` ไม่มี navbar

ถ้าเพิ่ม layout ระดับ root จะทำให้ `<html>` ซ้ำกัน — พัง

## Suspense Pattern

`<Navbar />` ใน `(front)/layout.tsx` ถูกครอบด้วย `<Suspense>` เพราะใช้ `useSearchParams`:

```typescript
// (front)/layout.tsx
<Suspense fallback={null}>
  <Navbar />
</Suspense>
```

ถ้า component ใหม่ใช้ `useSearchParams()` → ต้องครอบด้วย `<Suspense>` ด้วย

## Dynamic Rendering

```typescript
import { connection } from "next/server"

export default async function DynamicPage() {
  await connection()  // บอก Next.js ว่า route นี้ dynamic
  // ดึงข้อมูลหลัง connection() เสมอ
  const data = await prisma.products.findMany()
  ...
}
```

## Metadata

```typescript
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ชื่อหน้า",
  description: "คำอธิบายหน้า",
}
```

## Loading State

สร้าง `loading.tsx` ข้างๆ `page.tsx`:
```typescript
// src/app/(front)/course/loading.tsx
export default function Loading() {
  return <AppLoading />  // ใช้ component จาก (front)/components/app-loading.tsx
}
```

## Gotchas

- `"use client"` ต้องเป็นบรรทัดแรกของไฟล์ก่อน import ทั้งหมด
- Server Component ไม่สามารถ import Client Component ที่ `export default` เป็น async ได้ตรงๆ — ต้องผ่าน prop
- `Decimal` จาก Prisma serialize ไม่ได้ผ่าน Server→Client boundary — แปลง `Number()` ก่อนส่ง
- ไม่ใช้ `export default` ซ้ำในไฟล์เดียวกัน
