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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  productSchema,
  type ProductFormValues,
} from "@/lib/validations/product"
import type { AdminProduct, CategoryOption } from "@/types/admin"

type ProductFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: AdminProduct | null
  categories: CategoryOption[]
  onSaved: () => void
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: ProductFormModalProps) {
  const isEdit = product !== null

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              description: product.description ?? "",
              price: product.price,
              categoryId: product.categoryId ? String(product.categoryId) : "",
            }
          : defaultValues
      )
    }
  }, [open, product, form])

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"
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

      toast.success(isEdit ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ")
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
          <DialogTitle>{isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "แก้ไขข้อมูลสินค้าด้านล่าง"
              : "กรอกข้อมูลสินค้าใหม่ด้านล่าง"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ชื่อสินค้า</FieldLabel>
                  <Input
                    {...field}
                    placeholder="กรอกชื่อสินค้า"
                    disabled={isSubmitting}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>รายละเอียด</FieldLabel>
                  <Textarea
                    {...field}
                    placeholder="รายละเอียดสินค้า (ไม่จำเป็น)"
                    rows={3}
                    disabled={isSubmitting}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ราคา</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    disabled={isSubmitting}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>หมวดหมู่</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              {isSubmitting ? "กำลังบันทึก..." : isEdit ? "บันทึก" : "เพิ่มสินค้า"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
