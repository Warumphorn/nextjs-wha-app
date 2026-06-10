export type AdminStats = {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
  orderStatusBreakdown: OrderStatusCount[]
  monthlyRevenue: number
  monthlyOrders: number
}

export type OrderStatusCount = {
  status: string
  count: number
  label: string
}

export type RevenuePoint = {
  date: string
  revenue: number
  orders: number
}

export type AdminOrderItem = {
  id: number
  customer: string
  date: string
  status: string
  total: number
}

export type TopProduct = {
  id: number
  name: string
  soldCount: number
  revenue: number
}

export type Period = "7d" | "30d" | "90d"
