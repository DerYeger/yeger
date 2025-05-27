import { z } from 'zod'
import stationsJson from './stations.json'

export const StationSchema = z.object({
  name: z.string(),
  location: z.tuple([z.number(), z.number()]),
  stops: z.array(z.number()),
})

export type Station = z.infer<typeof StationSchema>

const stationData = z.record(z.string(), StationSchema).parse(stationsJson)

const getAll = () => {
  return Object.entries(stationData).map(([, station]) => station)
}

const getByName = (name: string) => {
  return stationData[name]
}

const stations = {
  getAll,
  getByName,
}

export default stations
