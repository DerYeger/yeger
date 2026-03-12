import * as z from 'zod'

const SecurityAssetSchema = z.object({
  type: z.enum(['security']),
  isin: z.string(),
  name: z.string(),
})
export type SecurityAsset = z.infer<typeof SecurityAssetSchema>

const CryptoAssetSchema = z.object({
  type: z.enum(['crypto']),
  symbol: z.string(),
  name: z.string(),
})

const CommodityAssetSchema = z.object({
  type: z.enum(['commodity']),
  name: z.string(),
})

const CashAssetSchema = z.object({
  type: z.enum(['cash']),
})

const CustomAssetSchema = z.object({
  type: z.enum(['custom']),
})

const RealEstateAssetSchema = z.object({
  type: z.enum(['real_estate']),
})

const HoldingSchema = z.object({
  id: z.string(),
  activityCount: z.number(),
  logo: z.string(),
  earliestActivityDate: z.string(),
  nickname: z.string().nullable(),
  asset: z.discriminatedUnion('type', [
    SecurityAssetSchema,
    CryptoAssetSchema,
    CommodityAssetSchema,
    CashAssetSchema,
    CustomAssetSchema,
    RealEstateAssetSchema,
  ]),
  position: z.object({
    isSold: z.boolean(),
  }),
})
export type Holding = z.infer<typeof HoldingSchema>

export const PerformanceResponseSchema = z.object({
  holdings: z.array(HoldingSchema),
  interval: z.object({
    start: z.string(),
    end: z.string(),
  }),
})
export type PerformanceResponse = z.infer<typeof PerformanceResponseSchema>
