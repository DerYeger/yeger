import type { Link } from '~~/types/types'

export function useLinks() {
  const homeLink = { to: '/', text: 'Home' } satisfies Link
  const appLink = { to: '/app', text: 'App' } satisfies Link
  const detailsLink = { to: '/details', text: 'Details' } satisfies Link

  const links = [homeLink, detailsLink, appLink] satisfies Link[]
  return { appLink, detailsLink, homeLink, links }
}
