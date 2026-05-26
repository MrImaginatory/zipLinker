"use client"

import { useState } from "react"
import { Copy, ExternalLink, Link2, Trash2 } from "lucide-react"

const existingLinks = [
  { id: 1, short: "go.th/hello", original: "https://example.com/very/long/url/that/needs/shortening", clicks: 234, created: "2 days ago" },
  { id: 2, short: "go.th/summer", original: "https://my-summer-vacation-photos-2024.com", clicks: 89, created: "1 week ago" },
  { id: 3, short: "go.th/docs", original: "https://docs.google.com/document/d/very-long-id", clicks: 1_024, created: "3 weeks ago" },
]

export default function LinksPage() {
  const [url, setUrl] = useState("")
  const [alias, setAlias] = useState("")

  return (
    <div className="p-8">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Add Links
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Create short, memorable links in seconds.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl tracking-tight text-ink">
          Create New Link
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-charcoal">
              Destination URL
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-input bg-background px-3.5 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <Link2 className="h-4 w-4 text-steel" />
              <input
                type="url"
                placeholder="https://example.com/your-long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-stone"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-charcoal">
              Custom Alias (optional)
            </label>
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-input bg-background px-3.5 py-2.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <span className="text-sm text-steel">go.th/</span>
              <input
                type="text"
                placeholder="my-custom-link"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-stone"
              />
            </div>
          </div>

          <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-deep">
            Shorten URL
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl tracking-tight text-ink">
            Your Links
          </h2>
          <span className="text-xs text-steel">{existingLinks.length} total</span>
        </div>

        <div className="mt-5 space-y-3">
          {existingLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-cream-soft p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                <Link2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">
                  {link.short}
                </p>
                <p className="truncate text-xs text-steel">
                  {link.original}
                </p>
              </div>
              <div className="hidden items-center gap-3 text-xs text-steel sm:flex">
                <span>{link.clicks.toLocaleString()} clicks</span>
                <span>{link.created}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-md p-2 text-steel transition-colors hover:bg-cream hover:text-ink">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="rounded-md p-2 text-steel transition-colors hover:bg-cream hover:text-ink">
                  <ExternalLink className="h-4 w-4" />
                </button>
                <button className="rounded-md p-2 text-steel transition-colors hover:bg-cream hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
