import { requestAuthenticated } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  const portfolioId = getRouterParam(event, 'portfolioId')
  if (!portfolioId) {
    throw createError({ statusCode: 400, message: 'Missing portfolioId' })
  }

  const { accounts } = await requestAuthenticated({
    endpoint: '/performance',
    event,
    method: 'POST',
    body: JSON.stringify({
      portfolioIds: [portfolioId],
      interval: {
        type: 'relative',
        value: '1d',
      },
    }),
    schema: BAVAccountsResponseSchema,
  })

  return accounts
})
