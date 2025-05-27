import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC } from 'react'

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
    <nav className='bg-gray-100 border-t-gray-200 border-t-2 sticky left-0 right-0 bottom-0 flex justify-evenly z-40'>
      {targets.map(({ href, icon }) => (
        <Link href={href} passHref key={href}>
          <a
            className={`${
              router.pathname === href ? 'text-gray-700' : 'text-gray-500'
            } hover:text-black transition-colors p-4`}
          >
            <Icon icon={icon} />
          </a>
        </Link>
      ))}
    </nav>
  )
}

export default Nav
