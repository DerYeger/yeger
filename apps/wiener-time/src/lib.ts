import { MonitorResponseSchema } from './model'

function calculateCenter(locations: [number, number][] | undefined): [number, number] | undefined {
  if (!locations || locations.length === 0) {
    return undefined
  }
  const [totalLat, totalLong] = locations.reduce<[number, number]>(
    ([accLat, accLong], [lat, long]) => {
      return [accLat + lat, accLong + long]
    },
    [0, 0],
  )
  return [totalLat / locations.length, totalLong / locations.length]
}

const API_URL = 'https://www.wienerlinien.at'

async function fetchMonitorData(stopIds: number[]) {
  const res = await fetch(`${API_URL}/ogd_realtime/monitor?rbl=${stopIds.join(',')}`)
  const monitorResponse = MonitorResponseSchema.parse(await res.json())
  if (monitorResponse.message.messageCode !== 1) {
    throw new Error(monitorResponse.message.value)
  }
  if (!monitorResponse.data) {
    throw new Error('No data')
  }
  return monitorResponse.data.monitors
}

function encodeStationName(name: string) {
  return name.replaceAll('/', '-:-').replaceAll('ß', '-ss-')
}
function decodeStationName(name: string) {
  return name.replaceAll('-:-', '/').replaceAll('-ss-', 'ß')
}

// Wiener Linien has coordinates mixed up, so we sort them desc, since Vienna's lat is much larger than the long
function fixCoordinates(coordinates: [number, number]) {
  return coordinates.sort((a, b) => b - a)
}

const centerOfVienna: [number, number] = [48.2082, 16.3738]

const boundsPadding = 0.5

const boundsOfVienna = [
  [48.117668 - boundsPadding, 16.18218 - boundsPadding],
  [48.322571 + boundsPadding, 16.566511 + boundsPadding],
] as const

function isInBounds(location: [number, number]): boolean {
  return (
    location[0] >= boundsOfVienna[0][0] &&
    location[0] <= boundsOfVienna[1][0] &&
    location[1] >= boundsOfVienna[0][1] &&
    location[1] <= boundsOfVienna[1][1]
  )
}

const lib = {
  boundsOfVienna,
  calculateCenter,
  centerOfVienna,
  decodeStationName,
  encodeStationName,
  fetchMonitorData,
  fixCoordinates,
  isInBounds,
}

export default lib
