import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useMemo } from 'react'
import type { FC } from 'react'

import { useFavorites } from '../utils/useFavorites'

import ClientOnly from './ClientOnly'
import { Stations } from './Stations'

const SearchForYourStation: FC = () => {
  return (
    <Link href="/stations" className="flex items-center justify-center gap-2 text-neutral-600 transition-colors hover:text-black">
      <Icon icon="fa:train" />
      See all stations
      <Icon icon="fa:bus" />
    </Link>
  )
}

export const FavoriteStations: FC<{ stations: string[] }> = ({
  stations,
}) => {
  const { favorites } = useFavorites()
  const favoriteStations = useMemo(
    () =>
      stations
        ?.map((stationName) => ({
          name: stationName,
          isFavorite: favorites[stationName] === true,
        }))
        .filter(({ isFavorite }) => isFavorite),
    [stations, favorites],
  )

  return (
    <ClientOnly>
      <Stations stations={favoriteStations} />
      {favoriteStations.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <SearchForYourStation />
        </div>
      )}
    </ClientOnly>
  )
}
