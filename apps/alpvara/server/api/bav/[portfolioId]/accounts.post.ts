import { requestAuthenticated } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  const portfolioId = getRouterParam(event, 'portfolioId')
  if (!portfolioId) {
    throw createError({ statusCode: 400, message: 'Missing portfolioId' })
  }

  const body = CreateBAVAccountRequestSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 422, message: 'Invalid request body' })
  }

  return await requestAuthenticated({
    endpoint: `/portfolios/${portfolioId}/holdings/custom`,
    event,
    method: 'POST',
    body: JSON.stringify(body.data),
    schema: CreateBAVAccountResponseSchema,
  })
})
