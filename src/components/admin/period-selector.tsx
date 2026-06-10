"use client"

import type { Period } from "@/types/admin-dashboard"

const periodOptions: { value: Period; label: string }[] = [
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "90d", label: "90 วัน" },
]

type PeriodSelectorProps = {
  period: Period
  onChange: (period: Period) => void
}

export function PeriodSelector({ period, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border p-0.5">
      {periodOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            period === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
