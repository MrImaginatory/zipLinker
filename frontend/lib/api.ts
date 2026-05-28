export const API_BASE_URL = "http://localhost:3001/api/v1"

const TOKEN_KEY = "jwt_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
  // Also set a same-origin cookie so the Next.js middleware (proxy.ts) can read it
  // for route guarding. The middleware runs at localhost:3000 and can only see
  // cookies set by localhost:3000, not the backend at localhost:3001.
  // 2 minutes = 120 seconds, matching JWT_EXPIRES_IN=2m
  document.cookie = `jwt_token=${token}; path=/; max-age=120; samesite=lax`
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  // Also clear the middleware cookie
  document.cookie = `jwt_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: "include",
    ...options,
  }

  const response = await fetch(url, defaultOptions)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        clearToken()
        localStorage.clear()
        sessionStorage.clear()

        // Call backend logout to clear the HttpOnly jwt_token cookie
        await fetch(`${API_BASE_URL}/users/logout`, {
          method: "POST",
          credentials: "include",
        }).catch(() => null)

        window.location.href = "/login"
      }
    }
    throw new Error(data?.message || "An unexpected error occurred")
  }

  return data
}
