import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { LayoutDashboard, Package, ShoppingCart, Users, Layers } from "lucide-react"
import { Logo } from "@/components/logo"
import LogoutButton from "@/components/logout-button"

const menuItems = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
  { href: "/dashboard/products", label: "สินค้า", icon: Package },
  { href: "/dashboard/categories", label: "หมวดหมู่", icon: Layers },
  { href: "/dashboard/customers", label: "ลูกค้า", icon: Users },
]

const Sidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {user && (
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar
