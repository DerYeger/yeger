import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'

import { FavoriteStations } from '../components/FavoriteStations'
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

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ stations }) => {
  return (
    <>
      <main className="mt-4 flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-1 flex-col">
          <h1 className="mb-4 text-3xl font-bold">Favorites</h1>
          <FavoriteStations stations={stations} />
        </div>
      </main>
    </>
  )
}

export default Home
