import { Icon } from '@iconify/react'
import type { FC } from 'react'

const FavoriteToggle: FC<{ stationName: string, isFavorite?: boolean | undefined }> = ({
  stationName,
  isFavorite,
}) => {
  const addFavorite = (_stationName: string) => {} // TODO
  const removeFavorite = (_stationName: string) => {} // TODO

  const toggleFavorite = () => {
    if (isFavorite) {
      return removeFavorite(stationName)
    }
    return addFavorite(stationName)
  }
  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={isFavorite === undefined}
    >
      <Icon
        icon={isFavorite ? 'fa:heart' : 'fa:heart-o'}
        className={`${
          isFavorite !== undefined
            ? 'text-red-500'
            : 'text-gray-300'
        } text-2xl transition-colors`}
      />
    </button>
  )
}

export default FavoriteToggle
