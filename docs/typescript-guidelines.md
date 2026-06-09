# TypeScript Guidelines (Next.js App Router)

## Core Principles
- ใช้ `type` แทน `interface` ตามแนวทางโปรเจกต์
- เปิด `strict` mode ใน `tsconfig.json`
- หลีกเลี่ยง `any` ทุกกรณี ใช้ `unknown` หากจำเป็น
- ใช้ `readonly` กับค่าที่ไม่ควรแก้ไข
- ใช้ `as const` กับตัวแปรคงที่ที่ใช้ซ้ำหลายจุด

## Folder Structure
- เก็บ type กลางไว้ที่ `/types`
- API response types อยู่ใน `/types/api`
- Component props แยกเป็นไฟล์ เช่น `button.types.ts`
- Domain-specific types จัดกลุ่มตาม feature module
- แยก type สำหรับ server และ client หากมี dependency ต่างกัน

## Coding Style
- ใช้ `async/await` กับ error handling ที่ชัดเจน
- ใช้ `zod` สำหรับ input/schema validation
- ให้กำหนด return type แบบ explicit เสมอ
- หลีกเลี่ยงการประกาศ type ซ้ำ ให้รวมศูนย์ที่เดียว
- ใช้ `Pick` / `Omit` เพื่อปรับแต่ง type แทนการสร้างใหม่
- ใช้ generic function เมื่อสามารถทำให้ reusable มากขึ้น
- ตั้งชื่อตัวแปรและ type ให้สื่อความหมาย ไม่ใช้ตัวย่อ
- เว้นวรรคและจัดโค้ดให้เป็นระเบียบตาม Prettier/ESLint
- หลีกเลี่ยงการประกาศฟังก์ชันที่ทำงานหลายหน้าที่ (single-responsibility)
- ใช้ discriminated unions เมื่อมีหลายกรณีในข้อมูลเดียว
- หลีกเลี่ยงการเขียน type ที่มีโครงสร้างซับซ้อนเกินไป ควรแยกย่อย
- ให้ใช้ `Record<K, V>` เมื่อต้องการ key-value mapping ที่ชัดเจน
