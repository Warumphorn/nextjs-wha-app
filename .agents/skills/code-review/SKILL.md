---
name: code-review
description: >
  Use this skill to review code changes in this Next.js 16 / React 19 project.
  Triggers on: "review this code", "check my PR", "is this correct", "does
  this follow our conventions", or when reviewing a diff. Checks for
  project-specific issues: Server vs Client component misuse, Prisma driver
  adapter patterns, Tailwind v4 usage, TypeScript type placement, and
  Thai-language UI conventions.
---

# Code Review Checklist

## 1. Next.js 16 / React 19 Correctness

- [ ] Server Components ไม่ใช้ `useState`, `useEffect`, หรือ browser API
- [ ] Client Components มี `"use client"` directive บรรทัดแรก
- [ ] `await connection()` อยู่ใน dynamic route ที่ต้องการ opt-in (เช่น product page)
- [ ] ไม่มี `src/app/layout.tsx` ระดับ root — ต้องอยู่ใน `(front)/layout.tsx` หรือ `(auth)/layout.tsx`
- [ ] `<Suspense>` ครอบ component ที่อาจ suspend ใน `(front)/layout.tsx`

## 2. Prisma v7 Patterns

- [ ] Import จาก `../../generated/prisma/client` ไม่ใช่ `@prisma/client`
- [ ] ใช้ singleton จาก `src/lib/prisma.ts` ไม่ได้สร้าง `PrismaClient` ใหม่
- [ ] ชื่อ model เป็น snake_case ตาม DB: `products`, `order_items`, `categories`
- [ ] `Decimal` field (price, total_amount) แปลงเป็น `Number()` ก่อนส่ง client
- [ ] ไม่ใช้ `npx prisma db push` (ห้ามในโปรเจกต์นี้)

## 3. TypeScript Conventions

- [ ] TypeScript Type ทุกตัวอยู่ใน `src/types/` ไม่ใช่ inline ในไฟล์อื่น
- [ ] ชื่อไฟล์ `.ts/.tsx` เป็น kebab-case: `product-service.ts`, `cart-store.ts`
- [ ] API response ใช้ pattern `{ success: true; data: T } | { success: false; error: string }`

## 4. Auth (better-auth)

- [ ] ใช้ `authClient.signIn.email()` / `authClient.signUp.email()` จาก `src/lib/auth-client.ts`
- [ ] เช็ค session บน server ผ่าน `auth.api.getSession()` ไม่ใช่ custom JWT decode
- [ ] ไม่เก็บ password ในตัวแปรหรือ log

## 5. Styling (Tailwind v4 + Shadcn)

- [ ] ไม่ import จาก `tailwindcss/plugin` (Tailwind v3) — ใช้ `@tailwindcss/postcss`
- [ ] ใช้ `cn()` จาก `@/lib/utils` สำหรับ conditional classes
- [ ] Component ใหม่ไปใน `src/components/ui/` (shared) หรือ `src/app/(front)/components/` (page-specific)
- [ ] ใช้ Remixicon สำหรับ icons (`ri-*`)

## 6. UI Language

- [ ] ข้อความที่ผู้ใช้เห็นเป็นภาษาไทย
- [ ] Error message ที่แสดงผลเป็นภาษาไทย
- [ ] `lang="th"` อยู่ใน layout แล้ว — ไม่ต้องเพิ่ม

## 7. Security Checks

- [ ] API route ใช้ `zod` parse request body ก่อนใช้ข้อมูล
- [ ] ไม่มี SQL ดิบ (raw query) — ใช้ Prisma methods เท่านั้น
- [ ] HTML ที่ gen จาก user input (เช่น nodemailer) escape ก่อนใส่ `<p>` tag
- [ ] `.env` ไม่ถูก import โดยตรง — ใช้ `process.env.VAR_NAME`

## Review Output Template

```
## สรุปการ Review

### ปัญหาที่ต้องแก้ (blocking)
- ...

### ข้อแนะนำ (non-blocking)
- ...

### ผ่านแล้ว
- ...
```
