export default defineEventHandler((event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }

  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')
})
