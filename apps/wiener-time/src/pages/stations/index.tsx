import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useState, useMemo } from 'react'
import { useDebounce } from 'use-debounce'

import Spinner from '../../components/Spinner'
import { Stations } from '../../components/Stations'
import stations from '../../stations'

export const getStaticProps: GetStaticProps<{
  stations: string[]
}> = async () => {
  return {
    props: {
      stations: stations.getAll().map((station) => station.name),
    },
    revalidate: 86400,
  }
}

const SearchPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  stations,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)
  const mappedStations = useMemo(
    () =>
      stations.map((stationName) => ({
        name: stationName,
        isFavorite: false, // TODO
      })),
    [stations],
  )
  const filteredStations = useMemo(() => {
    const normalizedSearchQuery = debouncedSearchQuery.toLowerCase()
    return mappedStations?.filter((station) =>
      station.name.toLowerCase().includes(normalizedSearchQuery),
    )
  }, [mappedStations, debouncedSearchQuery])

  return (
    <>
      {!mappedStations && <Spinner />}
      {mappedStations && (
        <main className="mt-4 flex flex-1 flex-col items-center px-4">
          <div className="w-full max-w-md">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">Stations</h1>
              <input
                type="text"
                className="min-w-0 rounded border border-gray-300 bg-gray-100 px-2 py-1"
                data-testid="station-search-input"
                value={searchQuery}
                placeholder="Search"
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
              />
            </div>
            <Stations stations={filteredStations ?? []} />
          </div>
        </main>
      )}
    </>
  )
}

export default SearchPage
