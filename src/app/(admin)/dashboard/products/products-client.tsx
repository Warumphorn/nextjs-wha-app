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
import type { AdminProduct, CategoryOption } from "@/types/admin"
import type { ApiResponse } from "@/types/api"
import { ProductFormModal } from "./product-form-modal"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

export function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)

  const PAGE_SIZE = 10

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const json: ApiResponse<CategoryOption[]> = await res.json()
      if (json.success) setCategories(json.data)
    } catch {
      // silent
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/admin/products?${params}`)
      const json: ApiResponse<{ products: AdminProduct[]; total: number }> =
        await res.json()
      if (json.success) {
        setProducts(json.data.products)
        setTotal(json.data.total)
      }
    } catch {
      toast.error("ไม่สามารถโหลดข้อมูลได้")
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts()
  }, [fetchProducts])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const openCreate = () => {
    setEditProduct(null)
    setFormOpen(true)
  }

  const openEdit = (product: AdminProduct) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const openDelete = (product: AdminProduct) => {
    setDeleteTarget(product)
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">สินค้า</h1>
          <p className="text-muted-foreground">จัดการรายการสินค้าทั้งหมด</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาสินค้า..."
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
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">รหัส</TableHead>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="w-24 text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้า"}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.categoryName ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(p.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(p)}
                        >
                          แก้ไข
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDelete(p)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                หน้า {page} จาก {totalPages} ({total} รายการ)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ก่อนหน้า
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ถัดไป
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSaved={fetchProducts}
      />

      <DeleteConfirmDialog
        product={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setDeleteTarget(null)
        }}
        onDeleted={fetchProducts}
      />
    </div>
  )
}
