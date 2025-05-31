/* eslint-disable react/no-array-index-key */
import { Icon } from '@iconify/react'
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { NextSeo } from 'next-seo'
import type { FC } from 'react'
import { useMemo } from 'react'

import FavoriteToggle from '../../components/FavoriteToggle'
import LazyMap, { LazyMarker } from '../../components/Map.lazy'
import Spinner from '../../components/Spinner'
import lib from '../../lib'
import lineClasses from '../../lineClasses.json'
import type { Departure, Line, Monitor } from '../../model'
import type { Station } from '../../stations'
import stations from '../../stations'
import { trpc } from '../../utils/trpc'

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

function formatMinutes(minutes: number) {
  return `${minutes} ${Math.abs(minutes) !== 1 ? 'minutes' : 'minute'}`
}

function formatDelay(delay: number) {
  return `${formatMinutes(Math.abs(delay))} ${delay > 0 ? 'late' : 'early'}`
}

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
    <div className="flex h-[40px] items-center justify-between">
      <div className="flex flex-col">
        {departureTime()}
        {delay !== 0 && (
          <span
            className="text-xs"
            style={{ color: delay > 0 ? 'red' : 'orange' }}
          >
            {formatDelay(delay)}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {departure.vehicle?.realtimeSupported && (
          <Icon icon="fluent:live-24-regular" className="text-green-500" />
        )}
        {departure.vehicle?.barrierFree && <Icon icon="fa:wheelchair" />}
      </div>
    </div>
  )
}

const lineClassRecord = lineClasses as Record<string, string>

const LineTitle: FC<{ line: string }> = ({ line }) => {
  const classes = lineClassRecord[line] ?? 'bg-black'
  return <span className={`rounded px-2 text-white ${classes}`}>{line}</span>
}

const LineComponent: FC<{ line: Line, maxDepartures?: number }> = ({
  line,
  maxDepartures = 4,
}) => {
  const shownDepartures = useMemo(
    () => line.departures?.departure.slice(0, maxDepartures) ?? [],
    [line.departures.departure, maxDepartures],
  )
  return (
    <div className="rounded border-2">
      <span className="flex items-center gap-2 bg-gray-100 p-4 font-bold">
        <LineTitle line={line.name} />
        {' '}
        {line.towards}
      </span>
      <div className="border-b-2" />
      <div className="flex flex-col">
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
    <div className="w-full sm:w-1/2 md:w-1/3 md:max-w-md lg:w-1/4 xl:w-1/5">
      <div className="m-2 flex flex-col">
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
  const stopIds = useMemo(() => station?.stops ?? [], [station?.stops])
  const { data: monitors, error: monitorError } =
    trpc.monitor.getAllByStopIds.useQuery(
      { stopIds },
      {
        refetchInterval: 30 * 1000,
        retry: 2,
      },
    )

  const markers = useMemo<[number, number][] | undefined>(
    () =>
      monitors?.map(({ locationStop }) => [
        locationStop.geometry.coordinates[1]!,
        locationStop.geometry.coordinates[0]!,
      ]),
    [monitors],
  )

  return (
    <>
      <NextSeo title={station.name} />
      <main className="flex flex-1 flex-col ">
        <div className="m-4 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">{station.name}</h1>
          <FavoriteToggle
            stationName={station.name}
          />
        </div>
        <div className="flex flex-1 flex-col items-center">
          {!monitors && !monitorError && <Spinner />}
          {!monitors && monitorError && (
            <div className="flex flex-1 items-center justify-center">
              {monitorError.message}
            </div>
          )}
          {monitors?.length === 0 && (
            <div className="flex flex-1 items-center justify-center">
              No data available :(
            </div>
          )}
          {monitors && monitors.length >= 1 && (
            <div className="h-[200px] w-full bg-[#F6EFE4]">
              <LazyMap
                center={[station.location[1], station.location[0]]}
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
                    position={marker}
                    interactive={false}
                  />
                ))}
              </LazyMap>
            </div>
          )}
          <div className="container my-2 flex flex-1 flex-wrap content-start justify-center px-2">
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
