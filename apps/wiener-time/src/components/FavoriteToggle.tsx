import { Icon } from '@iconify/react'
import { FC, useCallback } from 'react'
import { trpc } from '../utils/trpc'

const FavoriteToggle: FC<{ stationName: string; isFavorite?: boolean }> = ({
  stationName,
  isFavorite,
}) => {
  const utils = trpc.useContext()
  const invalidateQueries = useCallback(
    async () =>
      Promise.all([
        utils.invalidateQueries(['favorite.getAll']),
        utils.invalidateQueries(['favorite.getByStationName', { stationName }]),
      ]),
    [utils, stationName]
  )
  const addFavorite = trpc.proxy.favorite.add.useMutation({
    onSuccess: () => invalidateQueries(),
  })
  const removeFavorite = trpc.proxy.favorite.remove.useMutation({
    onSuccess: () => invalidateQueries(),
  })

  const changeInProgress = addFavorite.isLoading || removeFavorite.isLoading

  const toggleFavorite = () => {
    if (isFavorite) {
      return removeFavorite.mutateAsync({ stationName })
    }
    return addFavorite.mutateAsync({ stationName })
  }
  return (
    <button
      onClick={toggleFavorite}
      disabled={isFavorite === undefined || changeInProgress}
      className={`${changeInProgress && 'motion-safe:animate-pulse'}`}
    >
      <Icon
        icon={isFavorite ? 'fa:heart' : 'fa:heart-o'}
        className={`${
          isFavorite !== undefined && !changeInProgress
            ? 'text-red-500'
            : 'text-gray-300'
        } text-2xl transition-colors`}
      />
    </button>
  )
}

export default FavoriteToggle
