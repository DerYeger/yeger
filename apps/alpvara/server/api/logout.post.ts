export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')
})
