import { Icon } from '@iconify/react'
import { signOut, signIn, useSession } from 'next-auth/react'
import Image from 'next/future/image'
import Link from 'next/link'
import { FC } from 'react'

const Header: FC = () => {
  const session = useSession()

  return (
    <header className='py-2 px-4 bg-gray-100 border-b-gray-200 border-b-2 sticky top-0 z-40'>
      <div className='w-full flex items-center justify-between h-12'>
        {session.data ? (
          <Image
            src={session.data.user?.image ?? '/favicon.svg'}
            alt={session.data.user?.name ?? 'WienerTime'}
            width={48}
            height={48}
            className='rounded-lg'
          />
        ) : (
          <Image src='/favicon.svg' alt='WienerTime' width={48} height={48} />
        )}
        <div className='flex'>
          <Link href='/about'>
            <a className='h-[48px] w-[48px] flex justify-center items-center text-xl text-gray-400 hover:text-gray-600 transition-colors'>
              <Icon icon='fa:info' />
            </a>
          </Link>
          {session.data ? (
            <button
              title='Logout'
              onClick={() => signOut()}
              className='h-[48px] w-[48px] flex justify-center items-center text-xl text-gray-400 hover:text-gray-600 transition-colors'
            >
              <Icon icon='fa:sign-out' />
            </button>
          ) : (
            <button
              title='Login'
              onClick={() => signIn()}
              className='h-[48px] w-[48px] flex justify-center items-center text-xl text-gray-400 hover:text-gray-600 transition-colors'
            >
              <Icon icon='fa:sign-in' />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
