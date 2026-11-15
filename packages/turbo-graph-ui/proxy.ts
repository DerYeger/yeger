import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { isAuthorizedApiRequest, unauthorizedResponse } from './lib/auth'

/**
 * Central auth gate for the API.
 * Pages contain no data, as the client loads everything via the API once it has an auth code.
 */
export function proxy(req: NextRequest) {
  if (!isAuthorizedApiRequest(req)) {
    return unauthorizedResponse()
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
