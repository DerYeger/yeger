import * as s from '@yeger/streams/sync'
import { requestAuthenticated } from '~~/server/utils/client'
import { REIT_BDC_ISINs } from '~~/server/utils/wellKnownIsins'

export default defineEventHandler(async (event) => {
  const portfolios = await requestAuthenticated({
    endpoint: '/portfolios',
    event,
    schema: PortfolioResponseSchema,
  })
  const performance = await requestAuthenticated({
    endpoint: '/performance',
    event,
    method: 'POST',
    body: JSON.stringify({
      portfolioIds: portfolios.items.map((p) => p.id),
      interval: {
        type: 'relative',
        value: '1d',
      },
    }),
    schema: PerformanceResponseSchema,
  })

  const securities = getSecurities(performance)

  return securities.sort((a, b) => a.name.localeCompare(b.name))
})

function getSecurities(performance: PerformanceResponse) {
  const securities = s.toArray(
    s.pipe(
      performance.holdings,
      s.map(({ asset, ...security }) => {
        if (asset.type !== 'security') {
          return null
        }
        return {
          id: security.id,
          logo: security.logo,
          isSold: security.position.isSold,
          ...asset,
          warnings: getWarnings(asset),
        }
      }),
      s.filterDefined(),
    ),
  )

  const deduplicated = new Map<string, (typeof securities)[number]>()
  for (const security of securities) {
    const existing = deduplicated.get(security.isin)
    if (existing) {
      existing.isSold &&= security.isSold
      continue
    }
    deduplicated.set(security.isin, security)
  }

  return [...deduplicated.values()]
}

function getWarnings(asset: SecurityAsset) {
  const lowerCasedName = asset.name.toLowerCase()
  const leveraged = isLikelyLeveraged(lowerCasedName)
  const fund = couldBeFund(lowerCasedName) || leveraged

  const swap = fund && (isLikelySwap(lowerCasedName) || leveraged)

  return {
    fund,
    swap,
    reitBdc: REIT_BDC_ISINs.has(asset.isin),
  }
}

const FUND_INDICATOR_KEYWORDS = ['etf', 'ucits', 'acc', 'dist', 'eur', 'usd']
function couldBeFund(name: string) {
  const lowerCasedName = name.toLowerCase()
  return FUND_INDICATOR_KEYWORDS.some((keyword) => includesKeyword(lowerCasedName, keyword))
}

const LEVERAGED_KEYWORDS = ['leveraged', 'short', 'inverse']
function isLikelyLeveraged(name: string) {
  return LEVERAGED_KEYWORDS.some((keyword) => includesKeyword(name, keyword))
}

const SWAP_KEYWORDS = ['swap']
function isLikelySwap(name: string) {
  return SWAP_KEYWORDS.some((keyword) => includesKeyword(name, keyword))
}

function includesKeyword(name: string, keyword: string) {
  return (
    name.startsWith(keyword) ||
    name.endsWith(keyword) ||
    name.includes(` ${keyword} `) ||
    name.includes(`(${keyword})`)
  )
}
