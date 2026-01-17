'use client'

import { Icon } from '@iconify/react'
import type { FC } from 'react'

import { useFavorites } from '../utils/useFavorites'

const FavoriteToggle: FC<{ stationName: string }> = ({ stationName }) => {
  const { toggleFavorite, isFavorite } = useFavorites()
  const isFavoriteStation = isFavorite(stationName)
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(stationName)}
      data-testid={`station-favorite-toggle-${isFavoriteStation ? 'yes' : 'no'}-${stationName}`}
    >
      <Icon
        icon={isFavoriteStation ? 'fa:heart' : 'fa:heart-o'}
        className="text-2xl text-red-500"
      />
    </button>
  )
}

export default FavoriteToggle
