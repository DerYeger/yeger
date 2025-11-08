import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
import { QueryProvider } from '../components/QueryProvider'

import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark size-full">
      <body className="m-0 size-full">
        <main className="relative flex size-full flex-col">
          <NuqsAdapter>
            <QueryProvider>
              <Suspense fallback={<div className="size-full" />}>{children}</Suspense>
            </QueryProvider>
          </NuqsAdapter>
        </main>
      </body>
    </html>
  )
}
