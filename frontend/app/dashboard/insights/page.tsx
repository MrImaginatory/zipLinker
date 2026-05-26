"use client"

import { useState, useEffect } from "react"
import { BarChart3, Link2, MousePointerClick, TrendingUp } from "lucide-react"
import { fetchApi } from "@/lib/api"

interface AnalyticsData {
  totalLinks: number
  totalClicks: number
  activeLinks: number
  inactiveLinks: number
  avgClickRate: number
  linkTrend: string
  clickTrend: string
  rateTrend: string
}

export default function InsightsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchApi("/shortlinks/analytics")
        if (res && res.success && res.data) {
          setAnalytics(res.data)
        }
      } catch (err: any) {
        console.error("Failed to load analytics:", err)
        setError(err?.message || "Failed to load dashboard analytics")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const statsList = [
    {
      label: "Total Links",
      value: analytics ? analytics.totalLinks.toString() : "0",
      icon: Link2,
      change: analytics ? analytics.linkTrend : "+12% this month",
    },
    {
      label: "Total Clicks",
      value: analytics ? analytics.totalClicks.toLocaleString() : "0",
      icon: MousePointerClick,
      change: analytics ? analytics.clickTrend : "+28% this month",
    },
    {
      label: "Active Links",
      value: analytics ? analytics.activeLinks.toString() : "0",
      icon: BarChart3,
      change: analytics ? `${analytics.inactiveLinks} inactive` : "0 inactive",
    },
    {
      label: "Avg. Click Rate",
      value: analytics ? `${analytics.avgClickRate}%` : "0.0%",
      icon: TrendingUp,
      change: analytics ? analytics.rateTrend : "+3.2% vs last month",
    },
  ]

  return (
    <div className="p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Insights
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Track your link performance at a glance.
      </p>

      {error && (
        <div className="mt-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-12 flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statsList.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:border-beige-deep hover:bg-cream-soft/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream border border-beige-deep shadow-sm">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm text-steel font-medium">{stat.label}</span>
                  </div>
                  <p className="mt-4 font-display text-3xl tracking-tight text-ink">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-steel font-semibold">{stat.change}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
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
        </>
      )}
    </div>
  )
}
