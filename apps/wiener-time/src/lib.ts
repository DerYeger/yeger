import {
  MonitorResponseSchema,
} from './model'

function calculateCenter(locations: [number, number][] | undefined): [number, number] | undefined {
  if (!locations || locations.length === 0) {
    return undefined
  }
  const [totalX, totalY] = locations.reduce<[number, number]>(
    ([accX, accY], [locX, locY]) => {
      return [accX + locX, accY + locY]
    },
    [0, 0],
  )
  return [totalX / locations.length, totalY / locations.length]
}

const API_URL = 'https://www.wienerlinien.at'

async function fetchMonitorData(stopIds: number[]) {
  const res = await fetch(
    `${API_URL}/ogd_realtime/monitor?rbl=${stopIds.join(',')}`,
  )
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

const centerOfVienna: [number, number] = [48.2082, 16.3738]

const lib = {
  calculateCenter,
  centerOfVienna,
  decodeStationName,
  encodeStationName,
  fetchMonitorData,
}

export default lib
