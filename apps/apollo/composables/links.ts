import type { Link } from '~~/types/types'

export function useLinks() {
  const appLink = { to: '/app', text: 'App' } satisfies Link
  const detailsLink = { to: '/details', text: 'Details' } satisfies Link

  const links = [
    { to: '/', text: 'Home' },
    detailsLink,
    appLink,
  ] satisfies Link[]
  return { appLink, detailsLink, links }
}
