import { z } from "zod/v4"

export const categorySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่").max(255, "ชื่อหมวดหมู่ยาวเกินไป"),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
