"use client"

import { useState, useEffect } from "react"
import { BarChart3, Link2, MousePointerClick, TrendingUp, Copy, Check, Calendar, ArrowRight, PieChart } from "lucide-react"
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

interface Activity {
  id: string
  type: "creation" | "click"
  title: string
  description: string
  target: string
  timestamp: string
}

interface ClickStat {
  label: string
  clicks: number
}

interface TopDomain {
  domain: string
  clicks: number
}

interface ActivityPayload {
  lastAddedLink: {
    urlId: string
    shortCode: string
    longUrl: string
    clicks: number
    isActive: boolean
    createdAt: string
  } | null
  activities: Activity[]
  dailyClicks: ClickStat[]
  monthlyClicks: ClickStat[]
  topDomains: TopDomain[]
}

export default function InsightsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [activityData, setActivityData] = useState<ActivityPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const [analyticsRes, activityRes] = await Promise.all([
          fetchApi("/dashboard/insights"),
          fetchApi("/dashboard/activity")
        ])

        if (analyticsRes && analyticsRes.success && analyticsRes.data) {
          setAnalytics(analyticsRes.data)
        }

        if (activityRes && activityRes.success && activityRes.data) {
          setActivityData(activityRes.data)
        }
      } catch (err: any) {
        console.error("Failed to load dashboard details:", err)
        setError(err?.message || "Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCopyLink = (code: string) => {
    const shortUrl = `${window.location.origin.replace(":3000", ":3001")}/${code}`
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function formatRelativeTime(dateStr: string) {
    const now = new Date()
    const diffMs = now.getTime() - new Date(dateStr).getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const statsList = [
    {
      label: "Total Links",
      value: analytics ? analytics.totalLinks.toString() : "0",
      icon: Link2,
      change: analytics ? analytics.linkTrend : "+0.0% this month",
    },
    {
      label: "Total Clicks",
      value: analytics ? analytics.totalClicks.toLocaleString() : "0",
      icon: MousePointerClick,
      change: analytics ? analytics.clickTrend : "+0.0% this month",
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
      change: analytics ? analytics.rateTrend : "+0.0% vs last month",
    },
  ]

  // Graph math configurations - FULL WIDTH
  const graphData = activeTab === "daily"
    ? (activityData?.dailyClicks || [])
    : (activityData?.monthlyClicks || [])
  const maxClicksValue = Math.max(...graphData.map(d => d.clicks), 5)

  const padding = 45
  const chartHeight = 160
  const chartWidth = 710
  const barWidth = activeTab === "daily" ? 50 : 32
  const gap = graphData.length > 1 ? (chartWidth - barWidth * graphData.length) / (graphData.length - 1) : 0

  // Top Domain Clicks calculations for Pie/Donut Chart
  const topDomains = activityData?.topDomains || []
  const totalDomainClicks = topDomains.reduce((acc, curr) => acc + curr.clicks, 0)
  const CIRCUMFERENCE = 282.743 // 2 * pi * 45

  // Pre-compute each slice: percent, rotation offset, strokeDashoffset
  const donutSlices = (() => {
    let cumulative = 0
    return topDomains.map((item, idx) => {
      const percent = totalDomainClicks > 0
        ? item.clicks / totalDomainClicks
        : 1 / Math.max(topDomains.length, 1)
      const rotation = cumulative * 360 - 90
      const strokeDashoffset = CIRCUMFERENCE * (1 - percent)
      cumulative += percent
      return { item, idx, rotation, strokeDashoffset }
    })
  })()

  const sliceColors = [
    "#1a67d2", // Primary Blue
    "#10b981", // Emerald Green
    "#f59e0b", // Amber
    "#f43f5e", // Rose Red
    "#6366f1"  // Indigo Purple
  ]

  const sliceBgs = [
    "bg-primary",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500"
  ]

  return (
    <div className="p-8 pb-24 md:pb-8 mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl tracking-tight text-ink">
          Insights
        </h1>
        <p className="mt-1.5 text-sm text-steel">
          Track your link performance at a glance.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="loader" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* Interactive Graph Section - FULL WIDTH */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-xl tracking-tight text-ink">
                  Click Performance
                </h2>
                <p className="text-sm text-steel">
                  Visual click metrics over time.
                </p>
              </div>

              {/* Tabs Toggle */}
              <div className="inline-flex rounded-lg bg-cream p-1 border border-border">
                <button
                  onClick={() => setActiveTab("daily")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "daily"
                      ? "bg-card text-primary shadow-sm"
                      : "text-steel hover:text-ink"
                    }`}
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => setActiveTab("monthly")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${activeTab === "monthly"
                      ? "bg-card text-primary shadow-sm"
                      : "text-steel hover:text-ink"
                    }`}
                >
                  Last 12 Months
                </button>
              </div>
            </div>

            {/* Custom SVG Bar Chart - FULL WIDTH */}
            <div className="mt-8 w-full overflow-x-auto select-none scrollbar-none">
              <div className="w-full min-w-[480px]">
                <svg
                  className="w-full"
                  style={{ aspectRatio: "800 / 240" }}
                  viewBox="0 0 800 240"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Background Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                    const yPos = padding + chartHeight * (1 - ratio)
                    return (
                      <g key={idx}>
                        <line
                          x1={padding}
                          y1={yPos}
                          x2={padding + chartWidth}
                          y2={yPos}
                          stroke="var(--color-border)"
                          strokeDasharray="4 4"
                          strokeWidth={1}
                        />
                        <text
                          x={padding - 12}
                          y={yPos + 3}
                          textAnchor="end"
                          className="text-[10px] font-bold fill-steel"
                        >
                          {Math.round(ratio * maxClicksValue)}
                        </text>
                      </g>
                    )
                  })}

                  {/* Bars & Interactive Items */}
                  {graphData.map((item, idx) => {
                    const xPos = padding + idx * (barWidth + gap)
                    const barHeight = (item.clicks / maxClicksValue) * chartHeight
                    const yPos = padding + chartHeight - barHeight

                    return (
                      <g key={item.label} className="group cursor-pointer">
                        {/* Hover Tooltip box */}
                        <rect
                          x={xPos + barWidth / 2 - 35}
                          y={yPos - 30}
                          width={70}
                          height={22}
                          rx={5}
                          className="fill-ink opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        />
                        <text
                          x={xPos + barWidth / 2}
                          y={yPos - 15}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          {item.clicks} clicks
                        </text>

                        {/* Interactive Bar */}
                        <rect
                          x={xPos}
                          y={yPos}
                          width={barWidth}
                          height={barHeight}
                          rx={5}
                          className="fill-primary/80 group-hover:fill-primary transition-all duration-300"
                        />

                        {/* Static Click Count (shown above bar) */}
                        {item.clicks > 0 && (
                          <text
                            x={xPos + barWidth / 2}
                            y={yPos - 5}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-steel group-hover:fill-ink transition-colors duration-200"
                          >
                            {item.clicks}
                          </text>
                        )}

                        {/* X-Axis Labels */}
                        <text
                          x={xPos + barWidth / 2}
                          y={padding + chartHeight + 20}
                          textAnchor="middle"
                          className="text-[11px] font-semibold fill-steel group-hover:fill-ink transition-colors duration-200"
                        >
                          {item.label}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Lower Grid: 3-column Layout (Activity, Pie Chart, Last Added Link) */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Column 1: Recent Activity List (1-day activity) */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-[350px]">
              <div className="mb-4">
                <h2 className="font-display text-lg tracking-tight text-ink">
                  Recent Activity (24h)
                </h2>
                <p className="text-xs text-steel">
                  Shortener event logs in the past 24 hours.
                </p>
              </div>

              {activityData && activityData.activities.length > 0 ? (
                <div className="flow-root mt-2 flex-1 overflow-y-auto pr-1 scrollbar-none">
                  <ul className="-mb-8">
                    {activityData.activities.map((activity, idx) => {
                      const isCreation = activity.type === "creation"
                      const Icon = isCreation ? Link2 : MousePointerClick

                      return (
                        <li key={activity.id}>
                          <div className="relative pb-6">
                            {idx !== activityData.activities.length - 1 && (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                                aria-hidden="true"
                              />
                            )}
                            <div className="relative flex items-start space-x-2.5">
                              <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg border ${isCreation
                                  ? "bg-blue-50 border-blue-200 text-blue-600"
                                  : "bg-green-50 border-green-200 text-green-600"
                                }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1 py-0.5">
                                <div className="text-xs text-ink font-bold leading-tight">
                                  {activity.title}
                                </div>
                                <div className="text-[10px] text-steel leading-tight mt-0.5 truncate">
                                  {activity.description}
                                </div>
                                <div className="text-[9px] text-steel font-bold mt-1 inline-flex items-center gap-1 bg-cream px-1.5 py-0.5 rounded border border-border max-w-full">
                                  <ArrowRight className="h-2.5 w-2.5 text-primary" />
                                  <span className="truncate max-w-[140px]">{activity.target}</span>
                                </div>
                              </div>
                              <div className="text-[9px] font-semibold text-steel whitespace-nowrap pt-1">
                                {formatRelativeTime(activity.timestamp)}
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-cream-soft py-10 flex-1 text-center">
                  <Calendar className="h-8 w-8 text-steel opacity-40 mb-2" />
                  <p className="text-xs font-bold text-ink">No Activity (24h)</p>
                  <p className="text-[10px] text-steel mt-0.5 max-w-[180px]">Your dynamic logs populate here as events occur.</p>
                </div>
              )}
            </div>

            {/* Column 2: Top Domains Custom Donut Chart */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-[350px]">
              <div className="mb-4">
                <h2 className="font-display text-lg tracking-tight text-ink">
                  Top Domains
                </h2>
                <p className="text-xs text-steel">
                  Click share by link destination host.
                </p>
              </div>

              {activityData && activityData.topDomains.length > 0 ? (
                <div className="flex-1 flex flex-col justify-between mt-2">
                  {/* SVG Donut Chart */}
                  <div className="flex items-center justify-center py-1">
                    <svg className="h-32 w-32 select-none" viewBox="0 0 120 120">
                      {donutSlices.map(({ item, idx, rotation, strokeDashoffset }) => (
                        <circle
                          key={item.domain}
                          cx={60}
                          cy={60}
                          r={45}
                          fill="transparent"
                          stroke={sliceColors[idx % sliceColors.length]}
                          strokeWidth={13}
                          strokeDasharray={CIRCUMFERENCE}
                          strokeDashoffset={strokeDashoffset}
                          transform={`rotate(${rotation} 60 60)`}
                          style={{ transition: "stroke-dashoffset 0.5s ease" }}
                        />
                      ))}
                      {/* Center label */}
                      <text x="60" y="57" textAnchor="middle" className="text-[9px] font-bold fill-steel">Total</text>
                      <text x="60" y="68" textAnchor="middle" className="text-[11px] font-bold fill-ink">{totalDomainClicks}</text>
                    </svg>
                  </div>

                  {/* Legends Stack */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[120px] pr-1 scrollbar-none">
                    {activityData.topDomains.map((item, idx) => {
                      const percent = totalDomainClicks > 0
                        ? ((item.clicks / totalDomainClicks) * 100).toFixed(0)
                        : "0"
                      return (
                        <div key={item.domain} className="flex items-center justify-between text-[11px] leading-tight">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${sliceBgs[idx % sliceBgs.length]}`} />
                            <span className="font-semibold text-ink truncate max-w-[120px]">{item.domain}</span>
                          </div>
                          <span className="font-bold text-steel whitespace-nowrap">
                            {item.clicks} ({percent}%)
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-cream-soft py-10 flex-1 text-center">
                  <PieChart className="h-8 w-8 text-steel opacity-40 mb-2" />
                  <p className="text-xs font-bold text-ink">No Click Share Data</p>
                  <p className="text-[10px] text-steel mt-0.5 max-w-[180px]">Visitor clicks on shortened URLs will populate this share chart.</p>
                </div>
              )}
            </div>

            {/* Column 3: Last Added Link Card */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col h-[350px]">
              <div className="mb-4">
                <h2 className="font-display text-lg tracking-tight text-ink">
                  Last Added Link
                </h2>
                <p className="text-xs text-steel">
                  Your most recently shortened URL.
                </p>
              </div>

              {activityData && activityData.lastAddedLink ? (
                <div className="mt-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="rounded-lg border border-border bg-cream p-3 space-y-1">
                      <div className="text-[10px] text-steel uppercase font-bold tracking-wider">Short Link</div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-base text-primary truncate">
                          /{activityData.lastAddedLink.shortCode}
                        </span>
                        <button
                          onClick={() => handleCopyLink(activityData.lastAddedLink!.shortCode)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card hover:bg-cream-soft text-steel hover:text-ink transition-colors shadow-sm"
                          title="Copy Link"
                        >
                          {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] text-steel uppercase font-bold tracking-wider">Destination URL</div>
                      <p className="text-xs font-semibold text-ink break-all line-clamp-2 bg-cream-soft p-2 rounded-lg border border-border">
                        {activityData.lastAddedLink.longUrl}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border p-2 bg-card">
                        <div className="text-[10px] text-steel font-medium">Clicks</div>
                        <div className="text-base font-display font-bold text-ink mt-0.5">
                          {activityData.lastAddedLink.clicks}
                        </div>
                      </div>
                      <div className="rounded-lg border border-border p-2 bg-card">
                        <div className="text-[10px] text-steel font-medium">Status</div>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold mt-1.5 ${activityData.lastAddedLink.isActive
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                          {activityData.lastAddedLink.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[9px] font-bold text-steel text-center mt-4">
                    Created {new Date(activityData.lastAddedLink.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-cream-soft py-10 flex-1 text-center">
                  <Link2 className="h-8 w-8 text-steel opacity-40 mb-2" />
                  <p className="text-xs font-bold text-ink">No Links Shortened</p>
                  <p className="text-[10px] text-steel mt-0.5 max-w-[180px]">Create your first shortened link to see details here.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
