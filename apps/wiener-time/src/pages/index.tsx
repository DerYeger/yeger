import { Icon } from '@iconify/react'
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Link from 'next/link'
import type { FC } from 'react'
import { useMemo, useRef } from 'react'
import ViewportList from 'react-viewport-list'

import FavoriteToggle from '../components/FavoriteToggle'
import lib from '../lib'
import stations from '../stations'

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

export const Station: FC<{
  station: { name: string, isFavorite?: boolean }
}> = ({ station }) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link href={`/stations/${lib.encodeStationName(station.name)}`} className="text-neutral-700 transition-colors hover:text-black">
        {station.name}
      </Link>
      <FavoriteToggle
        stationName={station.name}
        isFavorite={station.isFavorite}
      />
    </div>
  )
}

export const Stations: FC<{
  stations: { name: string, isFavorite?: boolean }[]
}> = ({ stations }) => {
  const ref = useRef(null)
  return (
    <div className="scroll-container" ref={ref}>
      <ViewportList
        viewportRef={ref}
        items={stations}
        itemMinSize={24}
        margin={16}
      >
        {(station) => (
          <div key={station.name} className="mb-4">
            <Station station={station} />
          </div>
        )}
      </ViewportList>
    </div>
  )
}

const SearchForYourStation: FC = () => {
  return (
    <Link href="/stations" className="flex items-center justify-center gap-2 text-neutral-600 transition-colors hover:text-black">
      <Icon icon="fa:train" />
      See all stations
      <Icon icon="fa:bus" />
    </Link>
  )
}

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  stations,
}) => {
  const favoriteStations = useMemo(
    () =>
      stations
        ?.map((stationName) => ({
          name: stationName,
          isFavorite: false, // TODO
        }))
        .filter(({ isFavorite }) => isFavorite),
    [stations],
  )

  return (
    <>
      <main className="mt-4 flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-1 flex-col">
          <h1 className="mb-4 text-3xl font-bold">Favorites</h1>
          <Stations stations={favoriteStations} />
          {favoriteStations.length === 0 && (
            <div className="flex flex-1 items-center justify-center">
              <SearchForYourStation />
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Home
