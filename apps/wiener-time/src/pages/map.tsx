import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { useMemo } from 'react'
import lib from '../lib'
import LazyMap, { LazyMarker, LazyMarkerCluster } from '../components/Map.lazy'
import { useRouter } from 'next/router'
import stations from '../stations'

export const getStaticProps: GetStaticProps<{
  stations: { name: string; stops: number[]; location?: [number, number] }[]
}> = async () => {
  return {
    props: {
      stations: stations.getAll(),
    },
    revalidate: 86400,
  }
}

const MapPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  stations,
}) => {
  const router = useRouter()
  const markers = useMemo<{ name: string; location: [number, number] }[]>(
    () =>
      stations
        ?.filter((station) => station.location)
        .map(({ name, location }) => ({ name, location: location! })),
    [stations]
  )

  return (
    <>
      <main className='flex-1 flex flex-col'>
        <LazyMap
          center={lib.centerOfVienna}
          zoom={10}
          zoomControl={false}
          doubleClickZoom={false}
          markerZoomAnimation={false}
        >
          <LazyMarkerCluster>
            {markers?.map(({ name, location }) => (
              <LazyMarker
                position={location}
                title={name}
                key={name}
                eventHandlers={{
                  click: () =>
                    router.push(`/stations/${lib.encodeStationName(name)}`),
                }}
              />
            ))}
          </LazyMarkerCluster>
        </LazyMap>
      </main>
    </>
  )
}

export default MapPage
