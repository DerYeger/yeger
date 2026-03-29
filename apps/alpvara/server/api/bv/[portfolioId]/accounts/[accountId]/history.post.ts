import * as z from 'zod'
import { requestAuthenticated } from '~~/server/utils/client'

const INITIAL_VIRTUAL_PRICE = 100

export default defineEventHandler(async (event) => {
  const portfolioId = getRouterParam(event, 'portfolioId')
  if (!portfolioId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing portfolioId' })
  }

  const accountId = getRouterParam(event, 'accountId')
  if (!accountId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing accountId' })
  }

  const request = BVHistoryRequestSchema.safeParse(await readBody(event))
  if (!request.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid request body' })
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
    throw createError({ statusCode: 500, statusMessage: 'Unexpected number of created activities' })
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

const SYNTHETIC_SHARE_COUNT = 0.0000000001

function processRequest(request: BVHistoryRequest, accountId: string) {
  const finalBalance = getFinalBalance(request)
  const lastPrice = request.type === 'create' ? INITIAL_VIRTUAL_PRICE : request.lastQuote
  const baseShares = request.type === 'create' ? 0 : request.lastShares
  const executionDays = Object.entries(WEIGHTED_EXECUTION_DAYS)
  const selectedMonths = new Set(request.contributionMonths)
  const initialValue = baseShares * lastPrice
  const investedValue = initialValue + request.contributions

  if (finalBalance <= 0 || investedValue <= 0 || lastPrice <= 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Calculated prices must be strictly positive',
    })
  }

  // Use annual value ratio for end quote to avoid overly pessimistic end prices.
  const finalSharePrice = lastPrice * (finalBalance / investedValue)
  if (finalSharePrice <= 0) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Calculated prices must be strictly positive',
    })
  }

  const selectedExecutionDays = executionDays.filter(([executionDay]) => {
    const month = Number.parseInt(executionDay.split('-')[0]!, 10)
    return selectedMonths.has(month)
  })
  const totalExecutionWeight = selectedExecutionDays.reduce((sum, [, weight]) => sum + weight, 0)

  const preliminaryExecutions = executionDays.map(([executionDay, weight], index) => {
    const month = Number.parseInt(executionDay.split('-')[0]!, 10)
    const isContributionMonth = selectedMonths.has(month)
    const monthEndStep = (index + 1) / executionDays.length
    const quotePrice = lastPrice + (finalSharePrice - lastPrice) * monthEndStep
    if (quotePrice <= 0) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Calculated prices must be strictly positive',
      })
    }

    const contribution =
      isContributionMonth && totalExecutionWeight > 0
        ? request.contributions * (weight / totalExecutionWeight)
        : 0

    return {
      executionDay,
      weight,
      isContributionMonth,
      quotePrice,
      contribution,
      referenceShares: contribution / quotePrice,
    }
  })

  if (request.contributions === 0) {
    const quotes = preliminaryExecutions.map(({ executionDay, quotePrice }) => ({
      currency: 'EUR',
      datetime: `${request.year}-${executionDay}T08:00:00.000Z`,
      price: quotePrice,
    }))
    const activities = preliminaryExecutions.flatMap(({ executionDay, quotePrice }) => {
      const datetime = `${request.year}-${executionDay}T08:00:00.000Z`
      return [
        {
          assetIdentifierType: 'custom_asset',
          currency: 'EUR',
          datetime,
          holding_id: accountId,
          price: quotePrice,
          shares: SYNTHETIC_SHARE_COUNT,
          type: 'transfer_out' as const,
        },
        {
          assetIdentifierType: 'custom_asset',
          currency: 'EUR',
          datetime,
          holding_id: accountId,
          price: quotePrice,
          shares: SYNTHETIC_SHARE_COUNT,
          type: 'transfer_in' as const,
          description: `${quotePrice}`,
        },
      ]
    })

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
    throw createError({
      statusCode: 422,
      statusMessage: 'Calculated shares must be strictly positive',
    })
  }

  const monthlyExecutions = preliminaryExecutions.map((execution) => {
    const executionPrice =
      execution.contribution > 0
        ? execution.quotePrice * executionPriceMultiplier
        : execution.quotePrice
    if (executionPrice <= 0) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Calculated prices must be strictly positive',
      })
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
  const activities = monthlyExecutions.flatMap(
    ({ executionDay, executionPrice, quotePrice, shares, isContributionMonth }) => {
      const datetime = `${request.year}-${executionDay}T08:00:00.000Z`

      if (isContributionMonth && shares > 0) {
        return [
          {
            assetIdentifierType: 'custom_asset',
            currency: 'EUR',
            datetime,
            holding_id: accountId,
            price: executionPrice,
            shares,
            type: 'transfer_in' as const,
            description: `${quotePrice}`,
          },
        ]
      }

      return [
        {
          assetIdentifierType: 'custom_asset',
          currency: 'EUR',
          datetime,
          holding_id: accountId,
          price: quotePrice,
          shares: SYNTHETIC_SHARE_COUNT,
          type: 'transfer_out' as const,
        },
        {
          assetIdentifierType: 'custom_asset',
          currency: 'EUR',
          datetime,
          holding_id: accountId,
          price: quotePrice,
          shares: SYNTHETIC_SHARE_COUNT,
          type: 'transfer_in' as const,
          description: `${quotePrice}`,
        },
      ]
    },
  )

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
