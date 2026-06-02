"use client"

import { useState, useEffect } from "react"
import { Copy, ExternalLink, Link2, AlertCircle, Check, Edit2, X, QrCode, Download } from "lucide-react"
import { fetchApi } from "@/lib/api"
import { toast } from "sonner"
import { ReactQRCode } from "@lglab/react-qr-code"

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

  // Editing state
  const [editLinkId, setEditLinkId] = useState<string | null>(null)
  const [editUrl, setEditUrl] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  // QR modal state
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null)
  const [qrTheme, setQrTheme] = useState<'classic' | 'circular' | 'leafy'>('circular')

  const qrThemes = {
    classic: {
      dataModulesSettings: { style: 'square' as const },
      finderPatternInnerSettings: { style: 'square' as const },
      finderPatternOuterSettings: { style: 'square' as const }
    },
    circular: {
      dataModulesSettings: { style: 'circle' as const },
      finderPatternInnerSettings: { style: 'circle' as const },
      finderPatternOuterSettings: { style: 'rounded' as const }
    },
    leafy: {
      dataModulesSettings: { style: 'leaf' as const },
      finderPatternInnerSettings: { style: 'leaf-lg' as const },
      finderPatternOuterSettings: { style: 'leaf-lg' as const }
    }
  }

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

  async function handleToggleActive(id: string, currentActiveStatus: boolean) {
    try {
      setIsUpdating(id)
      const res = await fetchApi(`/shortlinks/activate-deactivate/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !currentActiveStatus }),
      })
      if (res && res.success) {
        setLinks((prev) =>
          prev.map((link) =>
            link.urlId === id ? { ...link, isActive: !currentActiveStatus } : link
          )
        )
        toast.success(!currentActiveStatus ? "Url Activated Successfully" : "Url Deactivated Successfully")
      } else {
        toast.error(res?.message || "Failed to toggle status")
      }
    } catch (err: any) {
      toast.error(err?.message || "Error toggling status")
    } finally {
      setIsUpdating(null)
    }
  }

  async function handleUpdateUrl(id: string, isActive: boolean) {
    if (!editUrl.trim()) return

    try {
      setIsUpdating(id)
      const res = await fetchApi(`/shortlinks/update/${id}`, {
        method: "PUT",
        body: JSON.stringify({ longUrl: editUrl.trim(), isActive }),
      })
      if (res && res.success) {
        setLinks((prev) =>
          prev.map((link) =>
            link.urlId === id ? { ...link, longUrlLink: editUrl.trim() } : link
          )
        )
        setEditLinkId(null)
        setEditUrl("")
        toast.success("Url Updated Successfully")
      } else {
        toast.error(res?.message || "Failed to update link")
      }
    } catch (err: any) {
      toast.error(err?.message || "Error updating link")
    } finally {
      setIsUpdating(null)
    }
  }

  async function downloadQR(format: 'png' | 'jpeg') {
    if (!qrModalUrl) return;

    try {
      const svgElement = document.querySelector("#qr-code-wrapper svg");
      if (!svgElement) throw new Error("SVG element not found");

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // Set dimensions
      const qrSize = 250;
      const paddingX = 40;
      const paddingTop = 40;
      const paddingBottom = 60;
      canvas.width = qrSize + (paddingX * 2);
      canvas.height = qrSize + paddingTop + paddingBottom;

      // Draw background (white)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Serialize SVG
      const xmlSerializer = new XMLSerializer();
      const svgString = xmlSerializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const DOMURL = window.URL || window.webkitURL || window;
      const svgUrl = DOMURL.createObjectURL(svgBlob);

      // Load SVG to Image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = svgUrl;
      });

      // Draw QR Code
      ctx.drawImage(img, paddingX, paddingTop, qrSize, qrSize);
      DOMURL.revokeObjectURL(svgUrl);

      // Explicitly load and draw the logo over the center (because canvas blocks SVG external images)
      const logoUrl = process.env.NEXT_PUBLIC_LOGO_PATH || '/ZipLinkerLogo.svg';
      const logoImg = new Image();
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve; // fallback to continue without crashing
        logoImg.src = logoUrl;
      });
      
      const scaleFactor = qrSize / 200; // 250 / 200 = 1.25
      const logoWidth = 48 * scaleFactor;
      const logoHeight = 48 * scaleFactor;
      const logoX = paddingX + (qrSize - logoWidth) / 2;
      const logoY = paddingTop + (qrSize - logoHeight) / 2;
      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
      DOMURL.revokeObjectURL(svgUrl);

      // Draw URL text below
      ctx.font = "14px monospace";
      ctx.fillStyle = "#666666"; // steel color
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(qrModalUrl, canvas.width / 2, paddingTop + qrSize + 30);

      // Download
      const dataUrl = canvas.toDataURL(`image/${format}`, 1.0);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `qrcode.${format}`;
      a.click();
    } catch (err) {
      console.error("Failed to download QR code", err);
      toast.error("Failed to download QR code");
    }
  }

  return (
    <div className="p-8 pb-24 md:pb-8 mx-auto">
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
                  {editLinkId === link.urlId ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="url"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm text-ink outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
                        placeholder="Enter new destination URL"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdateUrl(link.urlId, link.isActive)
                          if (e.key === "Escape") setEditLinkId(null)
                        }}
                      />
                    </div>
                  ) : (
                    <p className="truncate text-xs text-steel mt-1 font-mono max-w-lg" title={link.longUrlLink}>
                      {link.longUrlLink}
                    </p>
                  )}
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
                  {editLinkId === link.urlId ? (
                    <>
                      <button
                        onClick={() => handleUpdateUrl(link.urlId, link.isActive)}
                        title="Save"
                        disabled={isUpdating === link.urlId}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-green-500/30 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 shadow-sm transition-all focus:outline-none disabled:opacity-50"
                      >
                        {isUpdating === link.urlId ? <div className="loader !w-4" style={{ "--loader-size": "16px" } as React.CSSProperties} /> : <Check className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => setEditLinkId(null)}
                        title="Cancel"
                        disabled={isUpdating === link.urlId}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 shadow-sm transition-all focus:outline-none disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleActive(link.urlId, link.isActive)}
                        disabled={isUpdating === link.urlId}
                        title={link.isActive ? "Deactivate link" : "Activate link"}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none mr-2 ${
                          link.isActive ? "bg-primary" : "bg-steel/30"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span className="sr-only">Toggle active status</span>
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            link.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setEditLinkId(link.urlId)
                          setEditUrl(link.longUrlLink)
                        }}
                        title="Edit long URL"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-beige-deep bg-cream text-charcoal hover:bg-cream-deeper hover:text-ink shadow-sm transition-all focus:outline-none"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
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
                      <button
                        onClick={() => setQrModalUrl(link.shortUrl)}
                        title="View QR Code"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-beige-deep bg-cream text-charcoal hover:bg-cream-deeper hover:text-ink shadow-sm transition-all focus:outline-none"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-sm rounded-xl border border-border shadow-lg overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-display text-lg font-medium text-ink flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QR Code
              </h3>
              <button
                onClick={() => setQrModalUrl(null)}
                className="rounded-lg p-1.5 text-steel hover:bg-cream-soft hover:text-ink transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center justify-center bg-cream-soft">
              <div id="qr-code-wrapper" className="bg-white p-4 rounded-xl border border-beige-deep shadow-sm">
                <ReactQRCode
                  value={qrModalUrl}
                  size={200}
                  level="H"
                  marginSize={2}
                  imageSettings={{
                    src: process.env.NEXT_PUBLIC_LOGO_PATH || '/ZipLinkerLogo.svg',
                    width: 48,
                    height: 48,
                    excavate: true,
                    opacity: 1,
                  }}
                  dataModulesSettings={{ ...qrThemes[qrTheme].dataModulesSettings, color: "#1a1a1a" }}
                  finderPatternInnerSettings={{ ...qrThemes[qrTheme].finderPatternInnerSettings, color: "#ff6200" }}
                  finderPatternOuterSettings={{ ...qrThemes[qrTheme].finderPatternOuterSettings, color: "#1a1a1a" }}
                />
              </div>
              <p className="mt-4 mb-4 text-xs font-mono text-steel break-all text-center">
                {qrModalUrl}
              </p>
              
              {/* Theme Selector */}
              <div className="flex gap-2 w-full justify-center">
                {(['classic', 'circular', 'leafy'] as const).map(theme => (
                  <button
                    key={theme}
                    onClick={() => setQrTheme(theme)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                      qrTheme === theme 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-cream text-charcoal border border-beige-deep hover:bg-cream-deeper'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-border bg-card flex items-center justify-center gap-3">
              <button
                onClick={() => downloadQR('png')}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors focus:outline-none"
              >
                <Download className="h-4 w-4" />
                PNG
              </button>
              <button
                onClick={() => downloadQR('jpeg')}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cream px-4 py-2.5 text-sm font-semibold text-charcoal border border-beige-deep hover:bg-cream-deeper transition-colors focus:outline-none"
              >
                <Download className="h-4 w-4" />
                JPG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
