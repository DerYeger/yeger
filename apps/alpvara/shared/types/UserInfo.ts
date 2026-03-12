import * as z from 'zod'

const PermissionSchema = z.object({
  action: z.literal(['read', 'write']),
  resourceId: z.string(),
  resourceType: z.literal(['portfolio']),
})

export const UserInfoSchema = z.object({
  userId: z.string(),
  installationId: z.string(),
  state: z.enum(['active']),
  permissions: z.array(PermissionSchema),
})
export type UserInfo = z.infer<typeof UserInfoSchema>
