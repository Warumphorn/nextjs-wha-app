---
name: auth-flow
description: >
  Use this skill when implementing authentication features: login, signup,
  logout, session checking, or protecting routes and API endpoints. Triggers
  on: "add login", "protect this page", "check if user is logged in",
  "how does auth work here", "sign out the user", "get the current user",
  or any request involving better-auth in this project.
---

# Authentication Guide (better-auth)

## Architecture

```
src/lib/auth.ts          ← server config (email/password, DB tables)
src/lib/auth-client.ts   ← browser client (signIn, signUp, signOut, useSession)
src/app/api/auth/[...all]/route.ts  ← catch-all handler
```

## Client-Side Auth (ใน Client Components)

```typescript
"use client"
import { authClient } from "@/lib/auth-client"

// Login
const { data, error } = await authClient.signIn.email({
  email: formData.email,
  password: formData.password,
})
if (error) { /* แสดง error message ภาษาไทย */ }
if (data) router.push("/")  // redirect หลัง login

// Signup
const { data, error } = await authClient.signUp.email({
  email: formData.email,
  password: formData.password,
  name: formData.name,
})

// Logout
await authClient.signOut()
router.push("/login")

// Get current session (reactive)
const { data: session } = authClient.useSession()
const user = session?.user  // { id, email, name, image }
```

## Server-Side Session Check (ใน Server Components & API Routes)

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// ใน Server Component หรือ API route
const session = await auth.api.getSession({ headers: await headers() })

if (!session) {
  redirect("/login")  // หรือ return 401 response
}

const user = session.user  // { id, email, name }
```

## Protecting a Page (Server Component)

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  return <div>สวัสดี {session.user.name}</div>
}
```

## Protecting an API Route

```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json(
      { success: false, error: "กรุณาเข้าสู่ระบบ" },
      { status: 401 }
    )
  }
  // ดำเนินการต่อ...
}
```

## Database Tables

better-auth สร้าง tables เหล่านี้อัตโนมัติ:
- `user` — ข้อมูลผู้ใช้
- `session` — session tokens
- `account` — linked accounts
- `verification` — email verification tokens

ห้าม query โดยตรงผ่าน `prisma.User` ถ้าไม่จำเป็น — ใช้ `auth.api.getSession()` แทน

## ENV Variables Required

```
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=http://localhost:3000
```

## Gotchas

- `authClient` (client) และ `auth` (server) เป็นคนละ object — import ให้ถูก
- `auth.api.getSession()` ต้องรับ `headers` จาก `next/headers` — ไม่ใช่ request headers ตรงๆ
- Password ไม่เคย expose ในตัวแปรหรือ log — better-auth hash ให้เอง
- Session cookie ชื่อ `better-auth.session_token` — ห้ามลบ cookie อื่นโดยไม่ตั้งใจ
- ถ้าทำ redirect หลัง login ใน server action ต้อง call นอก try/catch (`redirect()` throw)
