"use client"

import { BarChart3, Link2, MousePointerClick, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Total Links",
    value: "24",
    icon: Link2,
    change: "+12% this month",
  },
  {
    label: "Total Clicks",
    value: "3,421",
    icon: MousePointerClick,
    change: "+28% this month",
  },
  {
    label: "Active Links",
    value: "18",
    icon: BarChart3,
    change: "6 expired",
  },
  {
    label: "Avg. Click Rate",
    value: "18.7%",
    icon: TrendingUp,
    change: "+3.2% vs last month",
  },
]

export default function InsightsPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Insights
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Track your link performance at a glance.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-steel">{stat.label}</span>
              </div>
              <p className="mt-4 font-display text-3xl tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-steel">{stat.change}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl tracking-tight text-ink">
          Recent Activity
        </h2>
        <p className="mt-1 text-sm text-steel">
          Your link activity will appear here once you start sharing links.
        </p>
        <div className="mt-6 flex items-center justify-center rounded-lg border border-dashed border-border bg-cream-soft py-16">
          <p className="text-sm text-steel">No activity yet</p>
        </div>
      </div>
    </div>
  )
}
