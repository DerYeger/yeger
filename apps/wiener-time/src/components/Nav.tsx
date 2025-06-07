import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { FC } from 'react'

const Nav: FC = () => {
  const router = useRouter()
  const targets = [
    {
      href: '/stations',
      icon: 'fa:search',
    },
    {
      href: '/',
      icon: 'fa:home',
    },
    {
      href: '/map',
      icon: 'fa:map',
    },
  ]
  return (
    <nav className="sticky inset-x-0 bottom-0 z-40 flex justify-evenly border-t-2 border-t-gray-200 bg-gray-100">
      {targets.map(({ href, icon }) => (
        <Link
          href={href}
          key={href}
          data-testid={`nav-link-${href}`}
          className={`${
            router.pathname === href ? 'text-gray-700' : 'text-gray-500'
          } p-4 transition-colors hover:text-black`}
        >
          <Icon icon={icon} />
        </Link>
      ))}
    </nav>
  )
}

export default Nav
