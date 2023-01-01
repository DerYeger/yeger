import type { Link } from '~~/types/types'

export function useLinks() {
  const homeLink = { to: '/', text: 'Home' } satisfies Link
  const appLink = { to: '/app', text: 'App' } satisfies Link
  const featuresLink = { to: '/features', text: 'Features' } satisfies Link

  const links = [homeLink, featuresLink, appLink] satisfies Link[]
  return { appLink, featuresLink, homeLink, links }
}
