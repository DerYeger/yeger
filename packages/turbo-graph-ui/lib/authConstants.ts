/** Query parameter that carries the auth code when opening the UI. The client stores it and removes it from the URL. */
export const AUTH_QUERY_PARAM = 'code'

/** Scheme of the `Authorization` header that carries the auth code. */
export const AUTH_SCHEME = 'Bearer'

/** Environment variable the server reads the expected auth code from. */
export const AUTH_CODE_ENV = 'TURBO_GRAPH_AUTH_CODE'
