'use client'

import { Icon } from '@iconify/react'
import type { FC, AnimationEvent } from 'react'
import { useState } from 'react'

import { useFavorites } from '../utils/useFavorites'

const FavoriteToggle: FC<{ stationName: string }> = ({ stationName }) => {
  const { toggleFavorite, isFavorite } = useFavorites()
  const isFavoriteStation = isFavorite(stationName)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    // Only animate when adding a favorite, not when rendering pre-favorited state.
    if (!isFavoriteStation) {
      setIsAnimating(true)
    } else {
      setIsAnimating(false)
    }

    toggleFavorite(stationName)
  }

  const handleAnimationEnd = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.animationName === 'heart-pop') {
      setIsAnimating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="favorite-toggle"
      aria-label={
        isFavoriteStation
          ? `Remove ${stationName} from favorites`
          : `Add ${stationName} to favorites`
      }
      data-testid={`station-favorite-toggle-${isFavoriteStation ? 'yes' : 'no'}-${stationName}`}
    >
      <span
        onAnimationEnd={handleAnimationEnd}
        className={`favorite-heart ${isFavoriteStation ? 'is-favorite' : ''} ${isAnimating ? 'is-animating' : ''}`}
      >
        <Icon icon={isFavoriteStation ? 'fa:heart' : 'fa:heart-o'} className="text-2xl" />
      </span>
    </button>
  )
}

export default FavoriteToggle
