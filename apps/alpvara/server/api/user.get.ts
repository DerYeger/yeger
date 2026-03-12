import { requestAuthenticated } from '~~/server/utils/client'

export default defineEventHandler(async (event) => {
  return await requestAuthenticated({
    endpoint: '/user',
    event,
    schema: UserInfoSchema,
  })
})
