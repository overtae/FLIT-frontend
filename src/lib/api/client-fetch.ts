async function refreshTokenAndRetry(endpoint: string, options: RequestInit): Promise<Response> {
  const refreshResponse = await fetch("/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!refreshResponse.ok) {
    window.location.href = "/auth/login";
    throw new Error("Failed to refresh token");
  }

  const requestHeaders = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return fetch(endpoint, {
    ...options,
    headers: Object.fromEntries(requestHeaders.entries()),
    credentials: "include",
  });
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const requestHeaders = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: Object.fromEntries(requestHeaders.entries()),
    credentials: "include",
  });

  if (response.status === 401) {
    return refreshTokenAndRetry(endpoint, options);
  }

  return response;
}
