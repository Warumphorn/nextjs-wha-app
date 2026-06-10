---
name: prisma-query
description: >
  Use this skill when writing, debugging, or reviewing Prisma database queries
  in this project. Triggers on: "query the database", "get products from DB",
  "write a Prisma query", "fetch orders", "update a record", "how do I join
  tables", or any request involving reading or writing to MariaDB through
  Prisma. Covers the driver adapter setup, snake_case model naming, Decimal
  handling, and relation queries specific to this schema.
---

# Prisma Query Guide

## Setup — Read This First

Prisma v7 ใน project นี้ใช้ driver adapter ไม่ใช่ URL connection ตรง:

```typescript
// src/lib/prisma.ts — singleton ที่ต้องใช้เสมอ
import prisma from "@/lib/prisma"
// หรือ relative path: import prisma from "../../lib/prisma"
```

**ห้ามสร้าง `new PrismaClient()` ใหม่ในไฟล์อื่น**

## Model Names (snake_case ตาม DB)

```
prisma.products        → products table
prisma.categories      → categories table
prisma.order_items     → order_items table
prisma.orders          → orders table
prisma.customers       → customers table
prisma.product_images  → product_images table
```

## Common Query Patterns

### ดึง products พร้อม relations

```typescript
const products = await prisma.products.findMany({
  include: {
    categories: true,
    product_images: {
      orderBy: { id: "asc" },
      take: 1,  // แค่รูปแรก
    },
  },
  orderBy: { id: "asc" },
})
```

### แปลง Decimal ก่อนส่ง Client Component

```typescript
// Decimal ส่งผ่าน boundary ไม่ได้ — ต้องแปลง
const serialized = products.map((p) => ({
  ...p,
  price: Number(p.price ?? 0),
}))
```

### ดึง product เดี่ยวด้วย id

```typescript
const product = await prisma.products.findUnique({
  where: { id: Number(params.id) },
  include: { categories: true, product_images: true },
})

if (!product) notFound()
```

### สร้าง order พร้อม items

```typescript
const order = await prisma.orders.create({
  data: {
    date: new Date(),
    customer_id: customerId,
    status: "processing",
    total_amount: totalAmount,
    order_items: {
      create: items.map((item) => ({
        product_id: item.productId,
        quantity: item.qty,
        price: item.price,
      })),
    },
  },
})
```

### filter + pagination

```typescript
const products = await prisma.products.findMany({
  where: {
    category_id: categoryId,
    name: { contains: searchTerm },
  },
  skip: (page - 1) * pageSize,
  take: pageSize,
})
```

## Schema Relations Reference

```
categories  1──* products  *──* order_items  *──1 orders *──1 customers
                     1──* product_images
```

## Gotchas

- `Decimal` (price, total_amount) — JSON.stringify ทำให้เป็น string ตัวเลขแปลกๆ → ต้อง `Number()` ก่อนเสมอ
- `orders_status` enum: `"delivered"` | `"received"` | `"processing"` — ต้องใช้ค่าตรงๆ
- `product_images.image_name` เป็น `String @db.Text` — เก็บชื่อไฟล์ ไม่ใช่ URL เต็ม
- ห้ามใช้ `prisma.$executeRaw` หรือ raw SQL — ใช้ Prisma methods เสมอ
- `npx prisma db push` ห้ามใช้ — schema จัดการจาก SQL DDL ภายนอก
- หลัง schema เปลี่ยน ต้อง `npx prisma generate` ก่อน restart dev server

## After Schema Changes

```bash
npx prisma generate   # regenerate client
# จากนั้น restart: npm run dev
```
