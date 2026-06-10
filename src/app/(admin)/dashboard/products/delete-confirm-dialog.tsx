"use client"

import { useState } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { AdminProduct } from "@/types/admin"

type DeleteConfirmDialogProps = {
  product: AdminProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function DeleteConfirmDialog({
  product,
  open,
  onOpenChange,
  onDeleted,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false)

  if (!product) return null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.error ?? "เกิดข้อผิดพลาด")
        return
      }

      toast.success(`ลบ "${product.name}" สำเร็จ`)
      onOpenChange(false)
      onDeleted()
    } catch {
      toast.error("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบ &ldquo;{product.name}&rdquo;? การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "กำลังลบ..." : "ลบสินค้า"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
