import * as client from 'openid-client'
import { config, dataStore, saveTokens } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  const { state } = getQuery(event)
  const unwrappedState = Array.isArray(state) ? state[0] : state
  if (!unwrappedState) {
    return new Error('Missing state parameter')
  }

  const data = dataStore.get(unwrappedState)
  if (!data) {
    return new Error('Invalid state parameter')
  }

  const { redirectUri } = useRuntimeConfig(event)

  // Exchange code for tokens
  const tokens = await client.authorizationCodeGrant(config, new URL(event.path, redirectUri), {
    pkceCodeVerifier: data.codeVerifier,
    expectedState: unwrappedState,
  })
  dataStore.delete(unwrappedState)
  saveTokens(event, tokens)

  return sendRedirect(event, '/')
})
