import * as s from '@yeger/streams/sync'
import { requestAuthenticated } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  const userInfo = await requestAuthenticated({
    endpoint: '/user',
    event,
    schema: UserInfoSchema,
  })
  const portfoliosWithWriteAccess = s.toSet(
    s.pipe(
      userInfo.permissions ?? [],
      s.filter((perm) => perm.action === 'write' && perm.resourceType === 'portfolio'),
      s.map((perm) => perm.resourceId),
    ),
  )
  if (portfoliosWithWriteAccess.size === 0) {
    return []
  }
  const portfolios = await requestAuthenticated({
    endpoint: '/portfolios',
    event,
    schema: PortfolioResponseSchema,
  })
  return portfolios.items.filter((portfolio) => portfoliosWithWriteAccess.has(portfolio.id))
})
