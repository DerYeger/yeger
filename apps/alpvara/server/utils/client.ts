import * as client from 'openid-client'
import type * as z from 'zod'

const IS_DEV = process.env.NODE_ENV === 'development'

const { clientId, redirectUri } = useRuntimeConfig()

export const issuer = 'https://connect.parqet.com'

// Configure the OAuth client
export const config = new client.Configuration(
  {
    issuer,
    authorization_endpoint: `${issuer}/oauth2/authorize`,
    token_endpoint: `${issuer}/oauth2/token`,
  },
  clientId,
)

if (IS_DEV) {
  // Allow HTTP redirect URIs (required for local development)
  // ⚠️ Never use this in production — always use HTTPS!
  client.allowInsecureRequests(config)
}

export const dataStore = new Map<string, { codeVerifier: string }>()

export async function generateAuthorizationUrl() {
  // Generate PKCE code verifier and challenge
  const codeVerifier = client.randomPKCECodeVerifier()
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier)

  // Generate random state for CSRF protection
  const state = client.randomState()

  // Store the code verifier - we'll need it when exchanging the code
  dataStore.set(state, { codeVerifier })

  // Build the authorization URL
  return client.buildAuthorizationUrl(config, {
    redirect_uri: redirectUri,
    scope: 'portfolio:read portfolio:write',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  })
}

export interface Request<T> {
  body?: string
  endpoint: `/${string}`
  event: InstanceType<typeof H3Event<EventHandlerRequest>>
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  schema: T
}

export async function requestAuthenticated<T extends z.ZodType>(
  options: Request<T>,
): Promise<z.infer<T>> {
  const response = await makeAuthenticatedRequest({
    ...options,
    accessToken: getCookie(options.event, 'access_token'),
    refreshToken: getCookie(options.event, 'refresh_token'),
  })
  if (!response.ok) {
    const responseBody = JSON.stringify(await response.json(), null, 2)
    if (IS_DEV) {
      // oxlint-disable-next-line no-console
      console.error(responseBody)
    }
    throw createError({
      statusCode: response.status,
      message: responseBody,
    })
  }
  const parsed = await response.json()
  return options.schema.parse(parsed)
}

export function saveTokens(
  event: InstanceType<typeof H3Event<EventHandlerRequest>>,
  tokens: { access_token: string; refresh_token?: string },
) {
  setCookie(event, 'access_token', tokens.access_token, {
    httpOnly: true,
    secure: !IS_DEV,
    sameSite: 'strict',
  })
  if (tokens.refresh_token) {
    setCookie(event, 'refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: !IS_DEV,
      sameSite: 'strict',
    })
  }
}

interface AuthenticatedRequestOptions<T> extends Request<T> {
  accessToken: string | undefined
  refreshToken: string | undefined
}

async function makeAuthenticatedRequest<T>(options: AuthenticatedRequestOptions<T>) {
  const { accessToken, body, endpoint, event, method, refreshToken } = options
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const headers = new Headers()
  if (body && (method === 'POST' || method === 'PUT')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await client.fetchProtectedResource(
    config,
    accessToken,
    new URL(endpoint, issuer),
    method ?? 'GET',
    body,
    headers,
  )

  if (response.status === 401 && refreshToken) {
    const tokens = await client.refreshTokenGrant(config, refreshToken)
    saveTokens(event, tokens)
    return await makeAuthenticatedRequest({
      ...options,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    })
  }

  return response
}
