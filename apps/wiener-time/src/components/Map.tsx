import type { MapOptions } from 'leaflet'
import type { FC } from 'react'
import type { MapContainerProps } from 'react-leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

const Map: FC<
  {
    center: [number, number]
    zoom: number
  } & MapContainerProps &
  MapOptions
> = ({ children, ...rest }) => {
  return (
    <MapContainer
      className="h-full flex-1"
      minZoom={10}
      maxZoom={20}
      {...rest}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {children}
    </MapContainer>
  )
}

export default Map
