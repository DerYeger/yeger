import Link from 'next/link'
import type { FC } from 'react'

import FavoriteToggle from '../components/FavoriteToggle'
import lib from '../lib'

export const Station: FC<{
  station: { name: string, isFavorite?: boolean }
}> = ({ station }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link href={`/stations/${lib.encodeStationName(station.name)}`} className="text-neutral-700 transition-colors hover:text-black" data-testid={`station-link-${station.name}`}>
        {station.name}
      </Link>
      <FavoriteToggle
        stationName={station.name}
      />
    </div>
  )
}
