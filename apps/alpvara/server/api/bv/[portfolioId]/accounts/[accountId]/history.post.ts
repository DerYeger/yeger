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

  const request = BVHistoryRequestSchema.safeParse(await readBody(event))
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

  const finalBalance = getFinalBalance(request.data)

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
          price: finalBalance / totalShares,
        },
      ],
    }),
    schema: z.object({}),
  })
})

const WEIGHTED_EXECUTION_DAYS = {
  '01-31': 1,
  '02-28': 1,
  '03-31': 1,
  '04-30': 1,
  '05-31': 1,
  '06-30': 2,
  '07-31': 1,
  '08-31': 1,
  '09-30': 1,
  '10-31': 1,
  '11-30': 2,
  '12-31': 1,
} as const satisfies Record<`${number}-${number}`, number>

function processRequest(request: BVHistoryRequest, accountId: string) {
  const lastPrice = request.type === 'create' ? INITIAL_VIRTUAL_PRICE : request.lastQuote
  const newShares = request.contributions / lastPrice
  const executionDays = Object.entries(WEIGHTED_EXECUTION_DAYS).slice(request.month - 1)
  const totalExecutionWeight = executionDays.reduce((sum, [, weight]) => sum + weight, 0)
  const sharesPerExecution = newShares / totalExecutionWeight
  const totalFees = request.administrativeCosts + request.socialSecurityFees
  const feePerExecution = totalFees / totalExecutionWeight
  const activities = executionDays.map(([executionDay, weight]) => ({
    assetIdentifierType: 'custom_asset',
    currency: 'EUR',
    datetime: `${request.year}-${executionDay}T08:00:00.000Z`,
    holding_id: accountId,
    price: lastPrice,
    shares: weight * sharesPerExecution,
    type: 'transfer_in',
    fee: weight * feePerExecution,
  }))
  const totalShares = request.type === 'create' ? newShares : request.lastShares + newShares
  return { activities, totalShares }
}

function getFinalBalance(request: BVHistoryRequest) {
  if (request.type === 'create') {
    return (
      request.contributions -
      request.administrativeCosts -
      request.socialSecurityFees +
      request.performance
    )
  }
  return (
    request.lastShares * request.lastQuote +
    request.contributions -
    request.administrativeCosts -
    request.socialSecurityFees +
    request.performance
  )
}
