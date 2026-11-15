import type { Metadata } from 'next'

import { App } from '../components/App'

export const metadata: Metadata = {
  title: 'Turbo Graph',
  description: 'Interactive visualization and execution of Turborepo task graphs.',
  icons: ['/favicon.ico'],
  // The auth code may be part of the URL, so never leak it via the Referer header
  referrer: 'no-referrer',
}

/** The page is a static shell. All data is loaded by the client via the authenticated API. */
export default function Home() {
  return <App />
}
