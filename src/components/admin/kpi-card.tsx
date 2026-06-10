import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type KpiCardProps = {
  title: string
  value: string
}

export function KpiCard({ title, value }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-normal text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}

export function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
