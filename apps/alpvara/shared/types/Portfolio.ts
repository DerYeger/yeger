import * as z from 'zod'

export const PortfolioSchema = z.object({
  id: z.string(),
  currency: z.string(),
  name: z.string(),
  createdAt: z.string(),
  distinctBrokers: z.array(z.string()),
})
export type Portfolio = z.infer<typeof PortfolioSchema>

export const PortfolioResponseSchema = z.object({
  items: z.array(PortfolioSchema),
})
export type PortfolioResponse = z.infer<typeof PortfolioResponseSchema>

export const CreatePortfolioRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Name must be at most 80 characters'),
})
export type CreatePortfolioRequest = z.infer<typeof CreatePortfolioRequestSchema>

export const CreatePortfolioResponseSchema = z.object({
  id: z.string(),
})
export type CreatePortfolioResponse = z.infer<typeof CreatePortfolioResponseSchema>

export const CreateActivitiesResponseSchema = z.object({
  createdActivities: z.array(
    z.object({
      _id: z.string(),
    }),
  ),
})
