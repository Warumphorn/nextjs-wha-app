---
name: tailwind-styling
description: >
  Use this skill when styling components, adding new UI elements, applying
  Tailwind classes, using Shadcn components, or fixing visual/layout issues
  in this project. Triggers on: "style this component", "add dark mode",
  "use a Shadcn component", "apply Tailwind classes", "the layout looks wrong",
  "add an icon", or any UI styling request. Covers Tailwind v4 differences,
  Shadcn radix-luma setup, cn() usage, and Remixicon patterns.
---

# Tailwind CSS v4 + Shadcn Styling Guide

## Critical: Tailwind v4 Differences

โปรเจกต์นี้ใช้ **Tailwind CSS v4** — มี breaking changes จาก v3:

| v3 (เก่า — ห้ามใช้)          | v4 (ใช้ใน project นี้)         |
|------------------------------|--------------------------------|
| `tailwindcss/plugin`         | `@tailwindcss/postcss`         |
| `tailwind.config.js`         | config ใน `globals.css`        |
| `@apply` ส่วนใหญ่ยังใช้ได้    | ใช้ utility classes แทนก่อน   |

## globals.css Structure

```css
@import "tw-animate-css";
@import "shadcn/tailwind.css";   /* Shadcn base + variables */
/* dark mode via .dark class — ไม่ใช่ media query */
```

## Shadcn Components

Style: **radix-luma** — components อยู่ใน `src/components/ui/`

Component ที่มีอยู่แล้ว:
- `badge`, `button`, `card`, `input`, `label`, `textarea`
- `navigation-menu`, `sheet`, `separator`, `table`
- `spinner`, `sonner` (toast), `field`
- `dot-pattern`, `particles` (decorative)

การใช้งาน:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
```

## cn() Utility — ใช้เสมอสำหรับ conditional classes

```typescript
import { cn } from "@/lib/utils"

// รวม class แบบ conditional
<div className={cn(
  "base-class p-4 rounded",
  isActive && "bg-primary text-white",
  isDisabled && "opacity-50 cursor-not-allowed",
  className  // รับ className prop จากภายนอก
)}>
```

## Icons — Remixicon

ใช้ class `ri-*` ตรงๆ ใน HTML — ไม่ต้อง import component:

```typescript
<i className="ri-shopping-cart-line text-xl" />
<i className="ri-user-line" />
<i className="ri-home-line" />
```

ค้นหา icon: https://remixicon.com/

## Dark Mode

Dark mode ใช้ `.dark` class บน root element — ไม่ใช่ `prefers-color-scheme`:

```typescript
// ใช้ Tailwind dark: modifier
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

## Common Patterns

### Card ที่ใช้บ่อยในโปรเจกต์

```typescript
import { Card, CardContent } from "@/components/ui/card"

<Card className="overflow-hidden hover:shadow-lg transition-shadow">
  <CardContent className="p-4">
    {/* content */}
  </CardContent>
</Card>
```

### Badge

```typescript
import { Badge } from "@/components/ui/badge"

<Badge variant="secondary">คอร์สใหม่</Badge>
<Badge>หมวดหมู่</Badge>
```

### Form Fields

```typescript
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<Field>
  <Label htmlFor="email">อีเมล</Label>
  <Input id="email" type="email" placeholder="กรอกอีเมล" />
</Field>
```

## Gotchas

- ไม่ใช้ `tailwindcss/plugin` — มันเป็น v3 syntax
- ถ้า Shadcn component ยังไม่มีใน `src/components/ui/` ต้องสร้างตาม radix-luma style
- `tw-animate-css` ให้ animation classes เช่น `animate-fade-in`
- background patterns ใช้ `<BackgroundPattern />` จาก `src/components/background-pattern.tsx`
- `particles` component ใช้ decorative particle effect ใน hero section
