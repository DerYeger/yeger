import { requestAuthenticated } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  const body = CreatePortfolioRequestSchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 422, message: 'Invalid request body' })
  }

  return await requestAuthenticated({
    endpoint: '/portfolios',
    event,
    method: 'POST',
    body: JSON.stringify(body.data),
    schema: CreatePortfolioResponseSchema,
  })
})
