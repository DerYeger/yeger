import { NextSeoProps } from 'next-seo'
import { clientEnv } from './env/schema.mjs'

const SEO: NextSeoProps = {
  titleTemplate: '%s — WienerTime',
  defaultTitle: 'WienerTime',
  description: 'Real-time traffic data of Wiener Linien monitors.',
  openGraph: {
    type: 'website',
    locale: 'en_EN',
    url: clientEnv.NEXT_PUBLIC_OG_URL,
    site_name: 'WienerTime',
    images: [
      {
        url: `${clientEnv.NEXT_PUBLIC_OG_URL}/logo.png`,
        height: 512,
        width: 512,
        alt: 'WienerTime',
      },
    ],
  },
  twitter: {
    handle: '@DerYeger',
    site: '@DerYeger',
    cardType: 'summary_large_image',
  },
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.svg',
      type: 'image/svg+xml',
    },
  ],
}

export default SEO
