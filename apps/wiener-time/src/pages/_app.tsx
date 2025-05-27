import '../styles/globals.css'
import '../styles/spinner.css'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/dist/shared/lib/utils'
import { trpc } from '../utils/trpc'
import { DefaultSeo } from 'next-seo'
import SEO from '../seo'
import Nav from '../components/Nav'
import Header from '../components/Header'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <DefaultSeo {...SEO} />
      <div className='min-h-[calc(100vh-50px)] flex flex-col'>
        <Header />
        <Component {...pageProps} />
      </div>
      <Nav />
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
