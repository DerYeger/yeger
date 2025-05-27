import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useState, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { Stations } from '..'
import Spinner from '../../components/Spinner'
import stations from '../../stations'
import { trpc } from '../../utils/trpc'

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
  const { data: favorites } = trpc.proxy.favorite.getAll.useQuery()
  const mappedStations = useMemo(
    () =>
      stations.map((stationName) => ({
        name: stationName,
        isFavorite: favorites?.has(stationName),
      })),
    [stations, favorites]
  )
  const filteredStations = useMemo(() => {
    const normalizedSearchQuery = debouncedSearchQuery.toLowerCase()
    return mappedStations?.filter((station) =>
      station.name.toLowerCase().includes(normalizedSearchQuery)
    )
  }, [mappedStations, debouncedSearchQuery])

  return (
    <>
      {!mappedStations && <Spinner />}
      {mappedStations && (
        <main className='flex-1 flex flex-col px-4 mt-4 items-center'>
          <div className='w-full max-w-md'>
            <div className='flex gap-4 justify-between items-center mb-4'>
              <h1 className='text-3xl font-bold'>All</h1>
              <input
                type='text'
                className='bg-gray-100 px-2 py-1 rounded border border-gray-300 min-w-0'
                value={searchQuery}
                placeholder='Search'
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
