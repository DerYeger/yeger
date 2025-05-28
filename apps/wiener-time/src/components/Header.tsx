import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-b-gray-200 bg-gray-100 px-4 py-2">
      <div className="flex h-12 w-full items-center justify-between">
        <Image src="/favicon.svg" alt="WienerTime" width={48} height={48} />
        <div className="flex">
          <Link href="/about">
            <a className="flex size-[48px] items-center justify-center text-xl text-gray-400 transition-colors hover:text-gray-600">
              <Icon icon="fa:info" />
            </a>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
