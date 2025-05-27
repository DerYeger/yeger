import { Icon } from '@iconify/react'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { FC, useMemo } from 'react'
import FavoriteToggle from '../../components/FavoriteToggle'
import Spinner from '../../components/Spinner'
import { Departure, Line, Monitor } from '../../model'
import { trpc } from '../../utils/trpc'
import lineClasses from '../../lineClasses.json'
import lib from '../../lib'
import { NextSeo } from 'next-seo'
import LazyMap, { LazyMarker } from '../../components/Map.lazy'
import stations, { Station } from '../../stations'

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: stations.getAll().map(({ name }) => ({
      params: { name: lib.encodeStationName(name) },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{
  station: Station
}> = async ({ params }) => {
  const stationName = lib.decodeStationName(params?.name as string)

  const station = stations.getByName(stationName)
  if (!station) {
    return {
      redirect: {
        destination: '/stations',
        permanent: false,
      },
    }
  }

  return {
    props: {
      station,
    },
    revalidate: 86400,
  }
}

const formatMinutes = (minutes: number) =>
  `${minutes} ${Math.abs(minutes) !== 1 ? 'minutes' : 'minute'}`

const formatDelay = (delay: number) =>
  `${formatMinutes(Math.abs(delay))} ${delay > 0 ? 'late' : 'early'}`

const DepartureListItem: FC<{ departure: Departure }> = ({ departure }) => {
  let delay = 0
  if (departure.departureTime.timePlanned && departure.departureTime.timeReal) {
    const planned = new Date(departure.departureTime.timePlanned).getTime()
    const expected = new Date(departure.departureTime.timeReal).getTime()
    delay = Math.ceil((expected - planned) / 1000 / 60)
  }

  const departureTime = () => {
    if (departure.departureTime.countdown === 0) {
      return <span>Now</span>
    }
    if (departure.departureTime.countdown === undefined) {
      return <></>
    }
    return <span>{formatMinutes(departure.departureTime.countdown)}</span>
  }

  return (
    <div className='flex justify-between items-center h-[40px]'>
      <div className='flex flex-col'>
        {departureTime()}
        {delay !== 0 && (
          <span
            className='text-xs'
            style={{ color: delay > 0 ? 'red' : 'orange' }}
          >
            {formatDelay(delay)}
          </span>
        )}
      </div>
      <div className='flex gap-2'>
        {departure.vehicle?.realtimeSupported && (
          <Icon icon='fluent:live-24-regular' className='text-green-500' />
        )}
        {departure.vehicle?.barrierFree && <Icon icon='fa:wheelchair' />}
      </div>
    </div>
  )
}

const lineClassRecord = lineClasses as Record<string, string>

const LineTitle: FC<{ line: string }> = ({ line }) => {
  const classes = lineClassRecord[line] ?? 'bg-black'
  return <span className={`px-2 text-white rounded ${classes}`}>{line}</span>
}

const LineComponent: FC<{ line: Line; maxDepartures?: number }> = ({
  line,
  maxDepartures = 4,
}) => {
  const shownDepartures = useMemo(
    () => line.departures?.departure.slice(0, maxDepartures) ?? [],
    [line.departures.departure, maxDepartures]
  )
  return (
    <div className='border-2 rounded'>
      <span className='p-4 font-bold flex gap-2 items-center bg-gray-100'>
        <LineTitle line={line.name} /> {line.towards}
      </span>
      <div className='border-b-2' />
      <div className='flex flex-col'>
        {shownDepartures.map((departure, index) => (
          <div
            key={index}
            className={`border-b-${
              index === shownDepartures.length - 1 ? '0' : '2'
            } px-4 py-2`}
          >
            <DepartureListItem departure={departure} />
          </div>
        ))}
      </div>
    </div>
  )
}

const MonitorComponent: FC<{ monitor: Monitor }> = ({ monitor }) => {
  return (
    <div className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 md:max-w-md'>
      <div className='flex flex-col m-2'>
        {monitor.lines.map((line) => (
          <LineComponent line={line} key={line.lineId} />
        ))}
      </div>
    </div>
  )
}

const StationPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  station,
}) => {
  const { data: monitors, error: monitorError } =
    trpc.proxy.monitor.getAllByStopIds.useQuery(
      { stopIds: station?.stops ?? [] },
      {
        refetchInterval: 30 * 1000,
        retry: 2,
      }
    )
  const { data: isFavorite } = trpc.proxy.favorite.getByStationName.useQuery({
    stationName: station.name,
  })

  const markers = useMemo<[number, number][] | undefined>(
    () =>
      monitors?.map(({ locationStop }) => [
        locationStop.geometry.coordinates[1]!,
        locationStop.geometry.coordinates[0]!,
      ]),
    [monitors]
  )

  return (
    <>
      <NextSeo title={station.name} />
      <main className='flex-1 flex flex-col '>
        <div className='flex items-center justify-between m-4'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl'>{station.name}</h1>
          <FavoriteToggle
            stationName={station.name}
            isFavorite={station && isFavorite}
          />
        </div>
        <div className='flex flex-1 flex-col items-center'>
          {!monitors && !monitorError && <Spinner />}
          {!monitors && monitorError && (
            <div className='flex-1 flex items-center justify-center'>
              {monitorError.message}
            </div>
          )}
          {monitors?.length === 0 && (
            <div className='flex-1 flex items-center justify-center'>
              No data available :(
            </div>
          )}
          {monitors && monitors.length >= 1 && (
            <div className='w-full h-[200px] bg-[#F6EFE4]'>
              <LazyMap
                center={station.location}
                zoom={16}
                zoomControl={false}
                touchZoom={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                markerZoomAnimation={false}
                dragging={false}
              >
                {markers?.map((marker, index) => (
                  <LazyMarker
                    key={index}
                    interactive={false}
                    position={marker}
                  />
                ))}
              </LazyMap>
            </div>
          )}
          <div className='container my-2 px-2 flex flex-1 flex-wrap content-start justify-center'>
            {monitors?.map((monitor, index) => (
              <MonitorComponent key={index} monitor={monitor} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}

export default StationPage
