"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations/category"
import type { AdminCategory } from "@/types/admin"

type CategoryFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: AdminCategory | null
  onSaved: () => void
}

const defaultValues: CategoryFormValues = {
  name: "",
}

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryFormModalProps) {
  const isEdit = category !== null

  const form = useForm<CategoryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(categorySchema) as any,
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        category
          ? { name: category.name }
          : defaultValues
      )
    }
  }, [open, category, form])

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const url = isEdit
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.error ?? "เกิดข้อผิดพลาด")
        return
      }

      toast.success(isEdit ? "แก้ไขหมวดหมู่สำเร็จ" : "เพิ่มหมวดหมู่สำเร็จ")
      onOpenChange(false)
      onSaved()
    } catch {
      toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
    }
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "แก้ไขชื่อหมวดหมู่ด้านล่าง"
              : "กรอกชื่อหมวดหมู่ใหม่ด้านล่าง"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ชื่อหมวดหมู่</FieldLabel>
                  <Input
                    {...field}
                    placeholder="กรอกชื่อหมวดหมู่"
                    disabled={isSubmitting}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "กำลังบันทึก..."
                : isEdit
                  ? "บันทึก"
                  : "เพิ่มหมวดหมู่"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
