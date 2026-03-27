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

  const { activities, quotes } = processRequest(request.data, accountId)

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
      quotes,
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
  const finalBalance = getFinalBalance(request)
  const lastPrice = request.type === 'create' ? INITIAL_VIRTUAL_PRICE : request.lastQuote
  const baseShares = request.type === 'create' ? 0 : request.lastShares
  const executionDays = Object.entries(WEIGHTED_EXECUTION_DAYS).slice(request.month - 1)
  const initialValue = baseShares * lastPrice
  const investedValue = initialValue + request.contributions

  if (finalBalance <= 0 || investedValue <= 0 || lastPrice <= 0) {
    throw createError({ statusCode: 422, message: 'Calculated prices must be strictly positive' })
  }

  // Use annual value ratio for end quote to avoid overly pessimistic end prices.
  const finalSharePrice = lastPrice * (finalBalance / investedValue)
  if (finalSharePrice <= 0) {
    throw createError({ statusCode: 422, message: 'Calculated prices must be strictly positive' })
  }

  const totalExecutionWeight = executionDays.reduce((sum, [, weight]) => sum + weight, 0)
  const preliminaryExecutions = executionDays.map(([executionDay, weight], index) => {
    const monthEndStep = (index + 1) / executionDays.length
    const quotePrice = lastPrice + (finalSharePrice - lastPrice) * monthEndStep
    if (quotePrice <= 0) {
      throw createError({ statusCode: 422, message: 'Calculated prices must be strictly positive' })
    }

    const contribution = request.contributions * (weight / totalExecutionWeight)
    return {
      executionDay,
      weight,
      quotePrice,
      contribution,
      referenceShares: contribution / quotePrice,
    }
  })

  if (request.contributions === 0) {
    const syntheticExecutionDay = executionDays[executionDays.length - 1]?.[0]
    const syntheticQuotePrice = preliminaryExecutions[preliminaryExecutions.length - 1]?.quotePrice

    if (!syntheticExecutionDay || !syntheticQuotePrice) {
      throw createError({ statusCode: 500, message: 'Failed to generate synthetic activity' })
    }

    const quotes = preliminaryExecutions.map(({ executionDay, quotePrice }) => ({
      currency: 'EUR',
      datetime: `${request.year}-${executionDay}T08:00:00.000Z`,
      price: quotePrice,
    }))
    const syntheticShareCount = 0.0000000001
    const activities = [
      {
        assetIdentifierType: 'custom_asset',
        currency: 'EUR',
        datetime: `${request.year}-${syntheticExecutionDay}T08:00:00.000Z`,
        holding_id: accountId,
        price: syntheticQuotePrice,
        shares: syntheticShareCount,
        type: 'transfer_out' as const,
      },
      {
        assetIdentifierType: 'custom_asset',
        currency: 'EUR',
        datetime: `${request.year}-${syntheticExecutionDay}T08:00:00.000Z`,
        holding_id: accountId,
        price: syntheticQuotePrice,
        shares: syntheticShareCount,
        type: 'transfer_in' as const,
      },
    ]

    return { activities, quotes }
  }

  const targetAddedShares = finalBalance / finalSharePrice - baseShares
  const referenceAddedShares = preliminaryExecutions.reduce(
    (sum, { referenceShares }) => sum + referenceShares,
    0,
  )
  const executionPriceMultiplier = referenceAddedShares / targetAddedShares
  if (
    targetAddedShares <= 0 ||
    referenceAddedShares <= 0 ||
    !Number.isFinite(executionPriceMultiplier) ||
    executionPriceMultiplier <= 0
  ) {
    throw createError({ statusCode: 422, message: 'Calculated shares must be strictly positive' })
  }

  const monthlyExecutions = preliminaryExecutions.map((execution) => {
    const executionPrice = execution.quotePrice * executionPriceMultiplier
    if (executionPrice <= 0) {
      throw createError({ statusCode: 422, message: 'Calculated prices must be strictly positive' })
    }

    return {
      ...execution,
      executionPrice,
      shares: execution.contribution / executionPrice,
    }
  })

  const quotes = monthlyExecutions.map(({ executionDay, quotePrice }) => ({
    currency: 'EUR',
    datetime: `${request.year}-${executionDay}T08:00:00.000Z`,
    price: quotePrice,
  }))
  const activities = monthlyExecutions.map(({ executionDay, executionPrice, shares }) => ({
    assetIdentifierType: 'custom_asset',
    currency: 'EUR',
    datetime: `${request.year}-${executionDay}T08:00:00.000Z`,
    holding_id: accountId,
    price: executionPrice,
    shares,
    type: 'transfer_in',
  }))

  return { activities, quotes }
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
