import useLocalStorage from 'use-local-storage'

export function useFavorites() {
  const [favorites, setFavorites] = useFavoritesStorage()
  const isFavorite = (stationName: string) => {
    return favorites[stationName] === true
  }
  const addFavorite = (stationName: string) => {
    if (isFavorite(stationName)) {
      return
    }
    setFavorites((favorites) => ({ ...favorites, [stationName]: true }))
  }
  const removeFavorite = (stationName: string) => {
    if (!isFavorite(stationName)) {
      return
    }
    setFavorites((favorites) => ({ ...favorites, [stationName]: false }))
  }

  const toggleFavorite = (stationName: string) => {
    if (isFavorite(stationName)) {
      return removeFavorite(stationName)
    }
    return addFavorite(stationName)
  }
  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }
}

function useFavoritesStorage() {
  return useLocalStorage<Record<string, boolean>>('favorites', {})
}
