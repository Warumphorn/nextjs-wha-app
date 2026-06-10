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
import type { AdminCategory } from "@/types/admin"

type DeleteConfirmDialogProps = {
  category: AdminCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function DeleteConfirmDialog({
  category,
  open,
  onOpenChange,
  onDeleted,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false)

  if (!category) return null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        toast.error(json.error ?? "เกิดข้อผิดพลาด")
        return
      }

      toast.success(`ลบ "${category.name}" สำเร็จ`)
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
          <AlertDialogTitle>ยืนยันการลบหมวดหมู่</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบ &ldquo;{category.name}&rdquo;?{" "}
            {category.productCount > 0
              ? `หมวดหมู่นี้มีสินค้าอยู่ ${category.productCount} รายการ ไม่สามารถลบได้`
              : "การกระทำนี้ไม่สามารถย้อนกลับได้"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting || category.productCount > 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "กำลังลบ..." : "ลบหมวดหมู่"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
