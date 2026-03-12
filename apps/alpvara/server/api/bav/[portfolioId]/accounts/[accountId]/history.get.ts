import { requestAuthenticated } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  const portfolioId = getRouterParam(event, 'portfolioId')
  if (!portfolioId) {
    throw createError({ statusCode: 400, message: 'Missing portfolioId' })
  }

  const accountId = getRouterParam(event, 'accountId')
  if (!accountId) {
    throw createError({ statusCode: 400, message: 'Missing accountId' })
  }

  const response = await requestAuthenticated({
    endpoint: `/portfolios/${portfolioId}/activities?activityType=transfer_in&assetType=custom&holdingId=${accountId}&max=500`,
    event,
    method: 'GET',
    schema: BAVActivitiesResponseSchema,
  })

  return response.activities
})
