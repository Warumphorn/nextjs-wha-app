"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { RiTerminalBoxLine } from "@remixicon/react"

type ApiResponse = {
  products: unknown[]
  courses: unknown[]
  version: unknown
}

const sections = [
  { key: "products" as const, label: "สินค้า", url: "/api/products", countLabel: "รายการ" },
  { key: "courses" as const, label: "หลักสูตร", url: "/api/courses", countLabel: "รายการ" },
  { key: "version" as const, label: "เวอร์ชัน", url: "/api/version", countLabel: "ข้อมูล" },
]

export default function ApiPage() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function callApi() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/data")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch {
      setError("การเรียก API ล้มเหลว")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <RiTerminalBoxLine className="size-8 text-primary" />
        <h1 className="text-2xl font-bold">API Playground</h1>
      </div>
      <p className="text-muted-foreground">
        รวม API ทั้งหมดไว้ใน endpoint เดียว —{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">GET /api/data</code>
      </p>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>ข้อมูลทั้งหมด</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                ดึงข้อมูลสินค้า หลักสูตร และเวอร์ชันพร้อมกัน
              </p>
              <code className="mt-1 block text-xs text-muted-foreground">GET /api/data</code>
            </div>
            <Badge variant="outline">GET</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Button onClick={callApi} disabled={loading}>
              {loading ? (
                <>
                  <Spinner /> กำลังโหลด...
                </>
              ) : (
                "เรียกใช้ API"
              )}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {data && (
            <div className="space-y-4">
              {sections.map(({ key, label, url }) => {
                const items = data[key]
                const count = Array.isArray(items) ? items.length : 1
                return (
                  <div key={key} className="rounded-lg border bg-muted/30 p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{label}</span>
                      <Badge variant="secondary">{count} {sections.find(s => s.key === key)!.countLabel}</Badge>
                      <code className="text-[10px]">{url}</code>
                    </div>
                    <pre className="max-h-60 overflow-auto rounded bg-background p-2 text-xs leading-relaxed">
                      {JSON.stringify(items, null, 2)}
                    </pre>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
