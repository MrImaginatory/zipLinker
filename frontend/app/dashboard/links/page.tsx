"use client"

import { useState, useEffect } from "react"
import { Copy, ExternalLink, Link2, AlertCircle, Check } from "lucide-react"
import { fetchApi } from "@/lib/api"

interface ShortLink {
  urlId: string
  longUrlLink: string
  shortUrl: string
  noOfClicks: number
  isActive: boolean
}

export default function LinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Fetch all links on component mount
  useEffect(() => {
    loadLinks()
  }, [])

  async function loadLinks() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetchApi("/shortlinks/all")
      if (res && res.success && Array.isArray(res.data)) {
        setLinks(res.data)
      } else {
        setLinks([])
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Failed to load short links")
    } finally {
      setLoading(false)
    }
  }

  async function handleShorten(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim()) return

    try {
      setSubmitting(true)
      setError(null)
      setSuccessMsg(null)

      const res = await fetchApi("/shortlinks/create", {
        method: "POST",
        body: JSON.stringify({ longUrl: url.trim() }),
      })

      if (res && res.success) {
        setSuccessMsg("Link shortened successfully!")
        setUrl("")
        // Refresh links list
        await loadLinks()
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message || "Failed to shorten link. Please verify the URL.")
    } finally {
      setSubmitting(false)
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleOpenLink(id: string, shortUrl: string) {
    window.open(shortUrl, "_blank", "noopener,noreferrer")
    setTimeout(async () => {
      try {
        const res = await fetchApi(`/shortlinks/count/${id}`)
        if (res && res.success) {
          const updatedClicks = res.data
          setLinks((prevLinks) =>
            prevLinks.map((link) =>
              link.urlId === id ? { ...link, noOfClicks: updatedClicks } : link
            )
          )
        }
      } catch (err) {
        console.error("Failed to update clicks count", err)
      }
    }, 800)
  }

  return (
    <div className="p-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Links
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Create short, memorable links and manage them in real-time.
      </p>

      {/* Create Link Card */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl tracking-tight text-ink">
          Create New Link
        </h2>

        <form onSubmit={handleShorten} className="mt-5 space-y-4">
          <div>
            <label htmlFor="destination-url" className="text-sm font-medium text-charcoal">
              Destination URL
            </label>
            <div className="mt-1.5 flex items-center gap-3 rounded-lg border border-input bg-background px-3.5 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Link2 className="h-5 w-5 text-steel shrink-0" />
              <input
                id="destination-url"
                type="url"
                required
                placeholder="Enter your destination URL (e.g. https://example.com/very-long-url)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-stone min-w-0"
              />
            </div>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive font-medium border border-destructive/20">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-600 font-medium border border-green-500/20">
              <Check className="h-4.5 w-4.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-deep shadow-sm hover:shadow active:scale-98 disabled:opacity-70 disabled:pointer-events-none min-w-[120px] h-10"
          >
            {submitting ? (
              <div className="loader !w-5" style={{ "--loader-size": "20px" } as React.CSSProperties} />
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>
      </div>

      {/* Your Links Card */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl tracking-tight text-ink">
            Your Links
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cream text-charcoal border border-beige-deep">
            {links.length} {links.length === 1 ? "link" : "links"}
          </span>
        </div>

        {loading ? (
          <div className="mt-12 flex justify-center py-8">
            <div className="loader" />
          </div>
        ) : links.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream-soft py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream border border-beige-deep shadow-sm">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg tracking-tight text-ink">No links shortened yet</h3>
            <p className="mt-1.5 text-sm text-steel max-w-xs">
              Paste your first long URL above and shorten it to start tracking clicks.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {links.map((link) => (
              <div
                key={link.urlId}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-border bg-cream-soft p-4.5 hover:border-beige-deep hover:bg-cream-deeper transition-all duration-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/10 shrink-0 shadow-sm max-sm:hidden">
                  <Link2 className="h-5.5 w-5.5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleOpenLink(link.urlId, link.shortUrl)}
                      className="text-base font-bold text-ink hover:text-primary transition-colors flex items-center gap-1.5 text-left focus:outline-none"
                    >
                      {link.shortUrl.replace(/^https?:\/\//, "")}
                      <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                    </button>
                    {!link.isActive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-steel mt-1 font-mono max-w-lg" title={link.longUrlLink}>
                    {link.longUrlLink}
                  </p>
                </div>
                
                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-steel shrink-0 border-t border-beige-deep/50 pt-3 sm:border-t-0 sm:pt-0">
                  <div className="flex flex-col sm:items-end">
                    <span className="text-sm font-bold text-ink">{link.noOfClicks.toLocaleString()}</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-steel/80">clicks</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 justify-end">
                  <button
                    onClick={() => handleCopy(link.urlId, link.shortUrl)}
                    title="Copy short link"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-beige-deep bg-cream text-charcoal hover:bg-cream-deeper hover:text-ink shadow-sm transition-all focus:outline-none"
                  >
                    {copiedId === link.urlId ? (
                      <Check className="h-4.5 w-4.5 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenLink(link.urlId, link.shortUrl)}
                    title="Open short link"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-beige-deep bg-cream text-charcoal hover:bg-cream-deeper hover:text-ink shadow-sm transition-all focus:outline-none"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
