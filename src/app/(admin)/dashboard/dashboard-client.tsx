"use client"

import { useEffect, useState, useCallback } from "react"
import type {
  AdminStats,
  RevenuePoint,
  AdminOrderItem,
  Period,
  TopProduct,
} from "@/types/admin-dashboard"
import type { ApiResponse } from "@/types/api"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { PeriodSelector } from "@/components/admin/period-selector"
import { Badge } from "@/components/ui/badge"

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  received: "default",
  processing: "secondary",
  delivered: "outline",
}

export function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(false)

  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [topProductsLoading, setTopProductsLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setStatsError(null)
    try {
      const res = await fetch("/api/admin/stats")
      const json: ApiResponse<AdminStats> = await res.json()
      if (json.success) {
        setStats(json.data)
      } else {
        setStatsError(json.error)
      }
    } catch {
      setStatsError("ไม่สามารถโหลดข้อมูลสถิติได้")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchRevenue = useCallback(async (p: Period) => {
    setRevenueLoading(true)
    try {
      const res = await fetch(`/api/admin/revenue?period=${p}`)
      const json: ApiResponse<RevenuePoint[]> = await res.json()
      if (json.success) {
        setRevenue(json.data)
      }
    } catch {
      // silent
    } finally {
      setRevenueLoading(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    setOrdersError(null)
    try {
      const res = await fetch("/api/admin/orders?limit=5")
      const json: ApiResponse<{ orders: AdminOrderItem[]; total: number }> =
        await res.json()
      if (json.success) {
        setOrders(json.data.orders)
      } else {
        setOrdersError(json.error)
      }
    } catch {
      setOrdersError("ไม่สามารถโหลดรายการคำสั่งซื้อได้")
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const fetchTopProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/top-products")
      const json: ApiResponse<TopProduct[]> = await res.json()
      if (json.success) {
        setTopProducts(json.data)
      }
    } catch {
      // silent
    } finally {
      setTopProductsLoading(false)
    }
  }, [])

  // Mount: fetch all
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats()
    fetchOrders()
    fetchTopProducts()
  }, [fetchStats, fetchOrders, fetchTopProducts])

  // Period change: refetch revenue
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRevenue(period)
  }, [period, fetchRevenue])

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
      fetchOrders()
      fetchTopProducts()
    }, 30_000)
    return () => clearInterval(interval)
  }, [fetchStats, fetchOrders, fetchTopProducts])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
        <p className="text-muted-foreground">ภาพรวมข้อมูลร้านค้า</p>
      </div>

      {/* KPI Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </div>
      ) : statsError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">{statsError}</p>
          <button
            onClick={fetchStats}
            className="mt-2 text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            ลองใหม่
          </button>
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <KpiCard
              title="ยอดขายวันนี้"
              value={formatCurrency(stats.todaySales)}
            />
            <KpiCard
              title="คำสั่งซื้อวันนี้"
              value={stats.todayOrders.toLocaleString("th-TH")}
            />
            <KpiCard
              title="รอดำเนินการ"
              value={stats.pendingOrders.toLocaleString("th-TH")}
            />
            <KpiCard
              title="สินค้าทั้งหมด"
              value={stats.totalProducts.toLocaleString("th-TH")}
            />
            <KpiCard
              title="ผู้ใช้ทั้งหมด"
              value={stats.totalUsers.toLocaleString("th-TH")}
            />
          </div>

          {/* Monthly Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <KpiCard
              title="ยอดขายเดือนนี้"
              value={formatCurrency(stats.monthlyRevenue)}
            />
            <KpiCard
              title="คำสั่งซื้อเดือนนี้"
              value={stats.monthlyOrders.toLocaleString("th-TH")}
            />
          </div>

          {/* Order Status Breakdown */}
          {stats.orderStatusBreakdown.length > 0 && (
            <div className="rounded-4xl border bg-card p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold">
                สถานะคำสั่งซื้อ
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.orderStatusBreakdown.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          statusVariant[item.status] ?? "secondary"
                        }
                      >
                        {item.label}
                      </Badge>
                    </div>
                    <span className="text-xl font-bold">
                      {item.count.toLocaleString("th-TH")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Revenue Chart + Top Products side by side */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-4xl border bg-card p-6 shadow-md xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">รายได้</h2>
            <PeriodSelector period={period} onChange={setPeriod} />
          </div>
          <RevenueChart data={revenue} loading={revenueLoading} />
        </div>

        {/* Top Selling Products */}
        <div className="rounded-4xl border bg-card p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">สินค้าขายดี</h2>
          {topProductsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-5 w-8 animate-pulse rounded bg-muted" />
                  <div className="h-5 flex-1 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-16 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              ยังไม่มีข้อมูลการขาย
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground w-5 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm truncate">{product.name}</span>
                  </div>
                  <div className="ml-3 shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      {product.soldCount.toLocaleString("th-TH")} ชิ้น
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-4xl border bg-card p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold">คำสั่งซื้อล่าสุด</h2>
        {ordersError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">{ordersError}</p>
            <button
              onClick={fetchOrders}
              className="mt-2 text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              ลองใหม่
            </button>
          </div>
        ) : (
          <RecentOrdersTable orders={orders} loading={ordersLoading} />
        )}
      </div>
    </div>
  )
}
