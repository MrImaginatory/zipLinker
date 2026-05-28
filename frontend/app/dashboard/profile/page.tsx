"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, LogOut, Mail, Shield, User, Monitor, Smartphone, Tablet, MapPin, Clock, XCircle, Activity } from "lucide-react"
import { fetchApi, clearToken } from "@/lib/api"
import { toast } from "sonner"

interface UserProfile {
  userName: string
  email: string
  createdAt: string
}

interface Session {
  jti: string
  ip: string
  userAgent: string
  browser: string
  os: string
  location: string
  loginTime: string
  isCurrentSession: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<"profile" | "sessions">("profile")

  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchApi("/users/profile")
        if (res && res.success && res.data) {
          setProfile(res.data)
        }
      } catch (err: any) {
        console.error("Failed to load profile details:", err)
        setError(err?.message || "Failed to load profile details")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
    loadSessions()
  }, [])

  async function loadSessions() {
    try {
      setLoadingSessions(true)
      const res = await fetchApi("/users/sessions")
      if (res && res.success && res.data) {
        setSessions(res.data)
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load active sessions")
    } finally {
      setLoadingSessions(false)
    }
  }

  async function handleRevokeSession(jti: string) {
    try {
      setRevoking(jti)
      const res = await fetchApi(`/users/sessions/${jti}`, { method: "DELETE" })
      if (res && res.success) {
        toast.success("Session revoked successfully")
        setSessions((prev) => prev.filter((s) => s.jti !== jti))
      } else {
        toast.error(res?.message || "Failed to revoke session")
      }
    } catch (err: any) {
      toast.error(err?.message || "Error revoking session")
    } finally {
      setRevoking(null)
    }
  }

  async function handleLogout() {
    try {
      await fetchApi("/users/logout", { method: "POST" }).catch(() => null)
    } finally {
      clearToken()
      localStorage.clear()
      sessionStorage.clear()
      router.push("/")
    }
  }

  const username = profile?.userName || "User"
  const email = profile?.email || "Email"
  const joined = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "N/A"
  const role = "Free Plan"
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="font-display text-3xl tracking-tight text-ink">
        Profile
      </h1>
      <p className="mt-1.5 text-sm text-steel">
        Manage your account settings.
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
        <div className="mt-8 grid gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-1 h-full">
            <div className="overflow-hidden rounded-xl border border-border bg-card text-center shadow-sm h-full">
              <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
              <div className="relative mx-auto -mt-16 flex h-32 w-32 items-center justify-center rounded-full bg-primary border-4 border-card">
                <span className="font-display text-5xl text-primary-foreground">
                  {initials}
                </span>
              </div>
              <div className="p-6 pt-4 pb-8">
                <p className="mt-2 text-sm font-medium text-primary bg-primary/10 inline-block px-4 py-1.5 rounded-full">{role}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-border/50 pb-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-steel hover:text-ink hover:border-beige-deep"
                  }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab("sessions")}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${activeTab === "sessions"
                  ? "border-primary text-primary"
                  : "border-transparent text-steel hover:text-ink hover:border-beige-deep"
                  }`}
              >
                Active Sessions
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h2 className="font-display text-xl tracking-tight text-ink mb-6">
                    Account Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-steel">Username</p>
                        <p className="truncate text-sm font-medium text-ink">{username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-steel">Email</p>
                        <p className="truncate text-sm font-medium text-ink">{email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-steel">Member Since</p>
                        <p className="truncate text-sm font-medium text-ink">{joined}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-steel">Plan</p>
                        <p className="truncate text-sm font-medium text-ink">{role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl tracking-tight text-destructive">
                      Danger Zone
                    </h2>
                    <p className="mt-1 text-sm text-steel">
                      Sign out of your account. This will end your current session.
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex shrink-0 items-center gap-2 rounded-md bg-destructive px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-destructive/90 shadow-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {activeTab === "sessions" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl tracking-tight text-ink flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Active Sessions
                    </h2>
                    {loadingSessions && <div className="loader !w-4" style={{ "--loader-size": "16px" } as React.CSSProperties} />}
                  </div>

                  {sessions.length === 0 && !loadingSessions ? (
                    <p className="text-sm text-steel">No active sessions found.</p>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((session) => (
                        <div key={session.jti} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border transition-colors ${session.isCurrentSession
                          ? "border-green-500 "
                          : "border-beige-deep bg-cream-soft hover:bg-cream-deeper"
                          }`}>
                          <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-beige-deep shadow-sm">
                              {session.os.toLowerCase().includes("windows") || session.os.toLowerCase().includes("mac") || session.os.toLowerCase().includes("linux") ? (
                                <Monitor className="h-5 w-5 text-steel" />
                              ) : session.os.toLowerCase().includes("ipad") || session.userAgent.toLowerCase().includes("tablet") ? (
                                <Tablet className="h-5 w-5 text-steel" />
                              ) : (
                                <Smartphone className="h-5 w-5 text-steel" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-semibold text-ink">
                                  {session.browser} on {session.os}
                                </p>
                              </div>
                              <div className="mt-1 flex items-center gap-3 text-xs text-steel flex-wrap">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {session.location === "Unknown Location" ? Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ") : session.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(session.loginTime).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 text-[11px] text-steel/60 font-mono">
                                IP: {session.ip}
                              </p>
                            </div>
                          </div>

                          {!session.isCurrentSession && (
                            <button
                              onClick={() => handleRevokeSession(session.jti)}
                              disabled={revoking === session.jti}
                              className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-destructive/20 bg-white px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-colors focus:outline-none disabled:opacity-50 h-8 sm:w-auto w-full"
                            >
                              {revoking === session.jti ? (
                                <div className="loader !w-3" style={{ "--loader-size": "12px" } as React.CSSProperties} />
                              ) : (
                                <>
                                  <XCircle className="h-3.5 w-3.5" />
                                  Revoke
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
