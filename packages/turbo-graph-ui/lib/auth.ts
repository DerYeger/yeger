import { timingSafeEqual } from 'node:crypto'
import process from 'node:process'

import { AUTH_CODE_ENV, AUTH_QUERY_PARAM, AUTH_SCHEME } from './authConstants'

function getExpectedCode(): string | undefined {
  const code = process.env[AUTH_CODE_ENV]
  return code ? code : undefined
}

/**
 * Checks a provided code against the code the server was started with.
 * Fails closed: if the server has no code configured, nothing is authorized.
 */
export function isValidAuthCode(code: string | null | undefined): boolean {
  const expected = getExpectedCode()
  if (!expected || !code) {
    return false
  }
  const a = Buffer.from(code)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * Requests authenticate via the `Authorization` header instead of a cookie.
 * Browsers scope cookies by host but not by port, so a cookie would be sent to every other server on `localhost`.
 * A header is only sent by the UI itself, which also rules out CSRF, as no ambient credentials exist.
 */
export function isAuthorizedRequest(req: Request): boolean {
  const header = req.headers.get('authorization')
  const prefix = `${AUTH_SCHEME} `
  if (!header?.startsWith(prefix)) {
    return false
  }
  return isValidAuthCode(header.slice(prefix.length))
}

/** Paths that also accept the code as a query parameter, because `EventSource` cannot send headers. */
const QUERY_PARAM_AUTH_PATHS = new Set(['/api/run'])

/**
 * Like {@link isAuthorizedRequest}, but routes in {@link QUERY_PARAM_AUTH_PATHS} may pass the code via the query parameter instead.
 * Other routes stay header-only, to keep the code out of as many URLs as possible.
 */
export function isAuthorizedApiRequest(req: Request): boolean {
  if (isAuthorizedRequest(req)) {
    return true
  }
  const url = new URL(req.url)
  return (
    QUERY_PARAM_AUTH_PATHS.has(url.pathname) &&
    isValidAuthCode(url.searchParams.get(AUTH_QUERY_PARAM))
  )
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

/** Environment for child processes, without the auth code. */
export function getChildProcessEnv(): NodeJS.ProcessEnv {
  const { [AUTH_CODE_ENV]: _, ...env } = process.env
  return env
}
