---
name: zustand-state
description: >
  Use this skill when working with client-side state management using Zustand
  in this project. Triggers on: "add to cart", "manage state", "use the cart
  store", "add Zustand state", "persist state to localStorage", "create a
  new store", or any request to read from or extend the Zustand cart store.
  Covers the existing cart store API, how to add new stores, and client
  component integration patterns.
---

# Zustand State Management Guide

## Existing Cart Store

`src/lib/cart-store.ts` — persists ไปที่ `localStorage` key `skill-cart`

### API

```typescript
import { useCartStore } from "@/lib/cart-store"

// ใน Client Component
const items = useCartStore((s) => s.items)
const addItem = useCartStore((s) => s.addItem)
const removeItem = useCartStore((s) => s.removeItem)
const clearCart = useCartStore((s) => s.clearCart)
const totalItems = useCartStore((s) => s.totalItems)   // function — ต้อง call: totalItems()
const totalPrice = useCartStore((s) => s.totalPrice)   // function — ต้อง call: totalPrice()
```

### CartItem Type (อยู่ใน src/types/ ถ้าแยกออก)

```typescript
type CartItem = {
  productId: string
  name: string
  price: number
  qty: number
}
```

### Usage Examples

```typescript
"use client"
import { useCartStore } from "@/lib/cart-store"

// เพิ่มสินค้า (ถ้ามีอยู่แล้ว qty จะบวกเพิ่ม)
addItem({ productId: "1", name: "สินค้า A", price: 199, qty: 1 })

// ลบสินค้า
removeItem("1")

// ล้างตะกร้า
clearCart()

// แสดงจำนวน
<span>{totalItems()} ชิ้น</span>

// แสดงราคารวม
<span>{totalPrice().toLocaleString("th-TH")} บาท</span>
```

## Adding a New Zustand Store

ถ้าต้องการ state ใหม่ที่ไม่เกี่ยวกับ cart สร้างไฟล์ใหม่ใน `src/lib/`:

```typescript
// src/lib/ui-store.ts
import { create } from "zustand"

type UiStore = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUiStore = create<UiStore>()((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}))
```

สำหรับ store ที่ต้อง persist:
```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      language: "th",
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: "user-preferences" }  // localStorage key
  )
)
```

## Selector Pattern (สำคัญสำหรับ performance)

```typescript
// ดี — subscribe เฉพาะส่วนที่ต้องการ
const totalItems = useCartStore((s) => s.totalItems)

// ไม่ดี — re-render ทุกครั้งที่ store เปลี่ยน
const store = useCartStore()
```

## Gotchas

- Zustand ใช้ได้เฉพาะใน **Client Components** — ต้องมี `"use client"` ก่อนเสมอ
- `totalItems` และ `totalPrice` เป็น **function** ไม่ใช่ value — ต้อง call `totalItems()` ไม่ใช่ `{totalItems}`
- `persist` middleware ใช้ `localStorage` — ไม่ทำงานใน Server Component หรือ SSR แรก
- localStorage key `skill-cart` เป็นชื่อที่ใช้อยู่จริง — ถ้าเปลี่ยนชื่อ data เก่าจะหาย
- ถ้า hydration mismatch (server vs client) ให้ใช้ `useEffect` เพื่อรอ mount ก่อนแสดง cart count
