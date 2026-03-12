import { generateAuthorizationUrl } from '~~/server/utils/client'

export default defineEventHandler(async () => {
  const url = await generateAuthorizationUrl()
  return url.toString()
})
