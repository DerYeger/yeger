import { AUTH_SCHEME } from './authConstants'

/**
 * The auth code is kept in `localStorage`, which is scoped to the origin (including the port).
 * Unlike a cookie, it is never sent to other servers on `localhost`.
 */
const STORAGE_KEY = 'turbo-graph-auth-code'

/** Dispatched on `window` whenever the server rejects the stored code, e.g., after a restart with a new code. */
export const UNAUTHORIZED_EVENT = 'turbo-graph:unauthorized'

export function getStoredAuthCode(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setStoredAuthCode(code: string) {
  try {
    window.localStorage.setItem(STORAGE_KEY, code)
  } catch {}
}

export function clearStoredAuthCode() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export function getAuthHeaders(code = getStoredAuthCode()): Record<string, string> {
  return code ? { Authorization: `${AUTH_SCHEME} ${code}` } : {}
}

export function handleUnauthorized() {
  clearStoredAuthCode()
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
}

/** `fetch` with the stored auth code. A 401 response clears the code and returns the UI to the code prompt. */
export async function authFetch(input: string | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  for (const [key, value] of Object.entries(getAuthHeaders())) {
    headers.set(key, value)
  }
  const res = await fetch(input, { ...init, headers })
  if (res.status === 401) {
    handleUnauthorized()
  }
  return res
}
