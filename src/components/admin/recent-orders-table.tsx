import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { AdminOrderItem } from "@/types/admin-dashboard"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  received: "default",
  processing: "secondary",
  delivered: "outline",
}

const statusLabel: Record<string, string> = {
  received: "รับแล้ว",
  processing: "กำลังดำเนินการ",
  delivered: "จัดส่งแล้ว",
}

type RecentOrdersTableProps = {
  orders: AdminOrderItem[]
  loading: boolean
}

export function RecentOrdersTable({ orders, loading }: RecentOrdersTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-5 w-12 animate-pulse rounded bg-muted" />
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        ยังไม่มีคำสั่งซื้อ
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>รหัส</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead className="text-right">ยอดรวม</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-xs">#{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              {new Date(order.date).toLocaleDateString("th-TH")}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[order.status] ?? "secondary"}>
                {statusLabel[order.status] ?? order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(order.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
