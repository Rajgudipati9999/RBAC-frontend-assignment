const BASE_URL = "http://localhost:4000/api/v1";

/**
 * Small wrapper around fetch that:
 * - prefixes the base URL
 * - attaches JWT from localStorage as Authorization header
 * - parses JSON and throws a rich Error on non-2xx
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // leave data as null if not valid JSON
    }
  }

  if (!res.ok) {
    const err = new Error(data?.message || "Request failed");
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

export { BASE_URL };