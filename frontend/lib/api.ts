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
    throw new Error(data?.message || "An unexpected error occurred")
  }

  return data
}
