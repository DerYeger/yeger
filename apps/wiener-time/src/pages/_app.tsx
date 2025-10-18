import '../styles/globals.css'
import '../styles/spinner.css'
import type { AppType } from 'next/dist/shared/lib/utils'
import Head from 'next/head'
import { generateDefaultSeo } from 'next-seo/pages'

import Header from '../components/Header'
import Nav from '../components/Nav'
import SEO from '../seo'
import { trpc } from '../utils/trpc'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        {generateDefaultSeo(SEO)}
      </Head>
      <div className="flex min-h-[calc(100vh-50px)] flex-col">
        <Header />
        <Component {...pageProps} />
      </div>
      <Nav />
    </>
  )
}

export default trpc.withTRPC(MyApp)
