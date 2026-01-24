import fs from 'node:fs/promises'
import process from 'node:process'

import csv from 'csvtojson'
import fetch from 'node-fetch'
import { z } from 'zod'

import lib from '../src/lib'
import { StaticStopDataSchema } from '../src/model'
import type { StaticStopData } from '../src/model'

async function fetchStaticStopData(): Promise<StaticStopData[]> {
  try {
    const res = await fetch(
      'https://www.wienerlinien.at/ogd_realtime/doku/ogd/wienerlinien-ogd-haltepunkte.csv',
    )
    const body = await res.text()
    const json = await csv({
      delimiter: ';',
      checkType: true,
      ignoreEmpty: true,
    }).fromString(body)

    const data = z
      .array(StaticStopDataSchema)
      .parse(json)
      .filter((stop) => stop.StopText && stop.Latitude && stop.Longitude && stop.DIVA)
    return data
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'CERT_HAS_EXPIRED'
    ) {
      console.warn('Wiener Linien API unavailable. Aborting update.')
      process.exit(0)
    }
    throw error
  }
}

function parseStations(stops: StaticStopData[]) {
  const stations = new Map<string, StaticStopData[]>()
  stops.forEach((stop) => {
    stations?.set(stop.StopText!, [...(stations?.get(stop.StopText!) ?? []), stop])
  })
  return Object.fromEntries(
    [...stations.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, stops]) => [
        name,
        {
          name,
          stops: stops.map((stop) => stop.StopID),
          location: lib.calculateCenter(
            stops
              .filter((stop) => stop.Latitude && stop.Longitude)
              .map((stop) => lib.fixCoordinates([stop.Latitude!, stop.Longitude!])),
          ),
        },
      ]),
  )
}

async function generate() {
  console.log('Fetching...')
  const stops = await fetchStaticStopData()

  console.log('Parsing...')
  const stations = parseStations(stops)

  console.log('Writing...')
  await fs.writeFile('./src/stations.json', `${JSON.stringify(stations, null, 2)}\n`, {
    flag: 'w',
  })

  console.log('Done')
}

void generate()
