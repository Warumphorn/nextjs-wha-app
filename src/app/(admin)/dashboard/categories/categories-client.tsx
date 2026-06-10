"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminCategory } from "@/types/admin"
import type { ApiResponse } from "@/types/api"
import { CategoryFormModal } from "./category-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

export function CategoriesClient() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<AdminCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories")
      const json: ApiResponse<AdminCategory[]> = await res.json()
      if (json.success) setCategories(json.data)
    } catch {
      toast.error("ไม่สามารถโหลดข้อมูลได้")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [fetchCategories])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  const filtered = search
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : categories

  const openCreate = () => {
    setEditCategory(null)
    setFormOpen(true)
  }

  const openEdit = (category: AdminCategory) => {
    setEditCategory(category)
    setFormOpen(true)
  }

  const openDelete = (category: AdminCategory) => {
    setDeleteTarget(category)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">หมวดหมู่</h1>
          <p className="text-muted-foreground">
            จัดการหมวดหมู่สินค้า ({filtered.length} รายการ)
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มหมวดหมู่
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาหมวดหมู่..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">รหัส</TableHead>
              <TableHead>ชื่อหมวดหมู่</TableHead>
              <TableHead className="w-24 text-right">สินค้า</TableHead>
              <TableHead className="w-24 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  {search
                    ? "ไม่พบหมวดหมู่ที่ค้นหา"
                    : "ยังไม่มีหมวดหมู่"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">#{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-right">
                    {c.productCount.toLocaleString("th-TH")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(c)}
                      >
                        แก้ไข
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDelete(c)}
                      >
                        ลบ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Modals */}
      <CategoryFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editCategory}
        onSaved={fetchCategories}
      />

      <DeleteConfirmDialog
        category={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setDeleteTarget(null)
        }}
        onDeleted={fetchCategories}
      />
    </div>
  )
}
