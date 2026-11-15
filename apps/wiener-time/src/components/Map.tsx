import type { MapOptions } from 'leaflet'
import type { FC } from 'react'
import type { MapContainerProps } from 'react-leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

import { CARTO_API_URL } from '../utils/carto'

import 'leaflet/dist/leaflet.css'

const Map: FC<
  {
    center: [number, number]
    zoom: number
  } & MapContainerProps &
    MapOptions
> = ({ children, ...rest }) => {
  return (
    <MapContainer className="h-full flex-1" minZoom={10} maxZoom={20} {...rest}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={CARTO_API_URL}
      />
      {children}
    </MapContainer>
  )
}

export default Map
