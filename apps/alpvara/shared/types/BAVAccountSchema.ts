import * as z from 'zod'

const BAVActivitySchema = z
  .object({
    type: z.literal('transfer_in'),
    holdingId: z.string(),
    shares: z.float64(),
    price: z.float64(),
    datetime: z.iso.datetime(),
  })
  .transform((data) => ({
    ...data,
    accountId: data.holdingId,
  }))
export type BAVActivity = z.infer<typeof BAVActivitySchema>

export const BAVActivitiesResponseSchema = z.object({
  activities: z.array(BAVActivitySchema),
})
export type BAVActivitiesResponse = z.infer<typeof BAVActivitiesResponseSchema>

export const BAVAccountSchema = z.object({
  asset: z.object({
    type: z.literal('custom'),
  }),
  id: z.string(),
  logo: z.string().nullable(),
  nickname: z.string(), // required for accounts
  position: z.object({
    currentPrice: z.float64(),
    currentValue: z.float64(),
    shares: z.float64(),
  }),
  quote: z.object({
    currency: z.literal('EUR'),
    datetime: z.iso.datetime(),
    price: z.float64(),
  }),
})
export type BAVAccount = z.infer<typeof BAVAccountSchema>

export const BAVAccountsResponseSchema = z
  .object({
    holdings: z.array(BAVAccountSchema),
  })
  .transform((data) => ({
    accounts: data.holdings,
  }))

export const CreateBAVAccountRequestSchema = z.object({
  name: z.string().min(1).max(80),
  assetProduct: z.literal('insurance'),
})
export type CreateBAVAccountRequest = z.infer<typeof CreateBAVAccountRequestSchema>

export const CreateBAVAccountResponseSchema = z.object({
  id: z.string(),
})
export type CreateBAVAccountResponse = z.infer<typeof CreateBAVAccountResponseSchema>

const BaseBAVHistoryRequestSchema = z.object({
  year: z
    .int()
    .max(new Date().getFullYear() - 1)
    .min(1900, 'Year must be after 1900'),
  contributions: z.number().min(0, 'Contributions must be positive'),
  finalBalance: z.number().min(0, 'Final balance must be positive'),
})

export const CreateBAVHistoryRequestSchema = BaseBAVHistoryRequestSchema.extend({
  type: z.literal('create'),
  contributions: z.number().min(1, 'Contributions must be positive'),
})
export type CreateBAVHistoryRequest = z.infer<typeof CreateBAVHistoryRequestSchema>

export const UpdateBAVHistoryRequestSchema = BaseBAVHistoryRequestSchema.extend({
  type: z.literal('update'),
  contributions: z.number().min(0, 'Contributions must be positive'),
  lastQuote: z.number().min(0, 'Last quote must be positive'),
  lastShares: z.number().min(0, 'Last shares must be positive'),
})
export type UpdateBAVHistoryRequest = z.infer<typeof UpdateBAVHistoryRequestSchema>

export const BAVHistoryRequestSchema = z.discriminatedUnion('type', [
  CreateBAVHistoryRequestSchema,
  UpdateBAVHistoryRequestSchema,
])
export type BAVHistoryRequest = z.infer<typeof BAVHistoryRequestSchema>
