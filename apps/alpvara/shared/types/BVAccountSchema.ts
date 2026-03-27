import * as z from 'zod'

const BVActivitySchema = z
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
export type BVActivity = z.infer<typeof BVActivitySchema>

export const BVActivitiesResponseSchema = z.object({
  activities: z.array(BVActivitySchema),
})
export type BVActivitiesResponse = z.infer<typeof BVActivitiesResponseSchema>

export const BVAccountSchema = z.object({
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
export type BVAccount = z.infer<typeof BVAccountSchema>

export const BVAccountsResponseSchema = z
  .object({
    holdings: z.array(BVAccountSchema),
  })
  .transform((data) => ({
    accounts: data.holdings,
  }))

export const CreateBVAccountRequestSchema = z.object({
  name: z.string().min(1).max(80),
  assetProduct: z.literal('insurance'),
})
export type CreateBVAccountRequest = z.infer<typeof CreateBVAccountRequestSchema>

export const CreateBVAccountResponseSchema = z.object({
  id: z.string(),
})
export type CreateBVAccountResponse = z.infer<typeof CreateBVAccountResponseSchema>

const BaseBVHistoryRequestSchema = z.object({
  year: z
    .int()
    .max(new Date().getFullYear() - 1)
    .min(1900, 'Year must be after 1900'),
  administrativeCosts: z.number().min(0, 'Administrative costs cannot be negative'),
  socialSecurityFees: z.number().min(0, 'Social security fees cannot be negative'),
  performance: z.number(),
})

export const CreateBVHistoryRequestSchema = BaseBVHistoryRequestSchema.extend({
  type: z.literal('create'),
  month: z.number().min(1).max(12),
  contributions: z.number().min(1, 'Contributions must be positive'),
})
export type CreateBVHistoryRequest = z.infer<typeof CreateBVHistoryRequestSchema>

export const UpdateBVHistoryRequestSchema = BaseBVHistoryRequestSchema.extend({
  type: z.literal('update'),
  month: z.literal(1),
  contributions: z.number().min(0, 'Contributions cannot be negative'),
  lastQuote: z.number().min(0, 'Last quote must be positive'),
  lastShares: z.number().min(0, 'Last shares must be positive'),
})
export type UpdateBVHistoryRequest = z.infer<typeof UpdateBVHistoryRequestSchema>

export const BVHistoryRequestSchema = z.discriminatedUnion('type', [
  CreateBVHistoryRequestSchema,
  UpdateBVHistoryRequestSchema,
])
export type BVHistoryRequest = z.infer<typeof BVHistoryRequestSchema>
