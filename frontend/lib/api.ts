import { toast } from "sonner"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

export async function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.clear();
  sessionStorage.clear();

  // Call backend logout to clear the HttpOnly cookies and Redis session
  await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => null);
}

// Track if a refresh is currently happening to avoid multiple calls
let isRefreshing = false;
let refreshSubscribers: ((token: boolean) => void)[] = [];

function onRefreshed(isSuccess: boolean) {
  refreshSubscribers.forEach(cb => cb(isSuccess));
  refreshSubscribers = [];
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // This ensures HttpOnly cookies (authToken, refreshToken) are automatically sent
    ...options,
  };

  let response: Response | undefined;
  let retries = 3;
  let networkError = null;

  while (retries > 0) {
    try {
      response = await fetch(url, defaultOptions);
      networkError = null;
      break; // Success, exit retry loop
    } catch (err) {
      networkError = err;
      retries--;
      if (retries > 0) {
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  if (networkError || !response) {
    if (typeof window !== "undefined") {
      toast.error("Unable to contact Server try later");
      if (window.location.pathname !== "/login") {
         await clearToken();
         setTimeout(() => {
             window.location.href = "/login";
         }, 1500);
      }
    }
    throw new Error("Unable to contact Server try later");
  }

  
  // If request failed with 401 and it wasn't the login or refresh endpoints
  if (response.status === 401 && endpoint !== "/users/login" && endpoint !== "/users/refresh") {
    // If not already refreshing, initiate refresh
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (refreshResponse.ok) {
          isRefreshing = false;
          onRefreshed(true);
        } else {
          isRefreshing = false;
          onRefreshed(false);
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
             await clearToken();
             window.location.href = "/login";
          }
          throw new Error("Session expired. Please log in again.");
        }
      } catch (err) {
        isRefreshing = false;
        onRefreshed(false);
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
             await clearToken();
             window.location.href = "/login";
        }
        throw err;
      }
    }

    // Wait for the refresh to complete
    const refreshSuccess = await new Promise<boolean>(resolve => {
      refreshSubscribers.push(resolve);
    });

    if (refreshSuccess) {
      // Retry the original request
      response = await fetch(url, defaultOptions);
    } else {
      throw new Error("Session expired. Please log in again.");
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "An unexpected error occurred");
  }

  return data;
}
