import * as z from 'zod'
import { requestAuthenticated } from '~~/server/utils/client'

const INITIAL_VIRTUAL_PRICE = 100

export default defineEventHandler(async (event) => {
  const portfolioId = getRouterParam(event, 'portfolioId')
  if (!portfolioId) {
    throw createError({ statusCode: 400, message: 'Missing portfolioId' })
  }

  const accountId = getRouterParam(event, 'accountId')
  if (!accountId) {
    throw createError({ statusCode: 400, message: 'Missing accountId' })
  }

  const request = BAVHistoryRequestSchema.safeParse(await readBody(event))
  if (!request.success) {
    throw createError({ statusCode: 422, message: 'Invalid request body' })
  }

  const { activities, totalShares } = processRequest(request.data, accountId)
  const response = await requestAuthenticated({
    endpoint: `/portfolios/${portfolioId}/activities`,
    event,
    method: 'POST',
    body: JSON.stringify({ activities }),
    schema: CreateActivitiesResponseSchema,
  })
  if (response.createdActivities.length !== activities.length) {
    throw createError({ statusCode: 500, message: 'Unexpected number of created activities' })
  }

  await requestAuthenticated({
    endpoint: `/portfolios/${portfolioId}/quotes/user-managed`,
    event,
    method: 'POST',
    body: JSON.stringify({
      holdingId: accountId,
      quotes: [
        {
          currency: 'EUR',
          datetime: `${request.data.year}-12-31T09:00:00.000Z`,
          price: request.data.finalBalance / totalShares,
        },
      ],
    }),
    schema: z.object({}),
  })
})

const EXECUTION_DAYS = [
  '01-31',
  '02-28',
  '03-31',
  '04-30',
  '05-31',
  '06-30',
  '07-31',
  '08-31',
  '09-30',
  '10-31',
  '11-30',
  '12-31',
] as const satisfies `${number}-${number}`[]

function processRequest(request: BAVHistoryRequest, accountId: string) {
  const lastPrice = request.type === 'create' ? INITIAL_VIRTUAL_PRICE : request.lastQuote
  const newShares = request.contributions / lastPrice
  const sharesPerExecution = newShares / EXECUTION_DAYS.length
  const activities = EXECUTION_DAYS.map((monthDay) => ({
    assetIdentifierType: 'custom_asset',
    currency: 'EUR',
    datetime: `${request.year}-${monthDay}T08:00:00.000Z`,
    holding_id: accountId,
    price: lastPrice,
    shares: sharesPerExecution,
    type: 'transfer_in',
  }))
  const totalShares = request.type === 'create' ? newShares : request.lastShares + newShares
  return { activities, totalShares }
}
