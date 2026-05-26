export const API_BASE_URL = "http://localhost:3001/api/v1"

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Important: include credentials so the backend session cookie (connect.sid) is sent & stored
    credentials: "include",
    ...options,
  }

  const response = await fetch(url, defaultOptions)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        localStorage.clear()
        sessionStorage.clear()
        document.cookie = "connect.sid=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        
        // Call backend logout to clear the HttpOnly connect.sid cookie from browser
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
