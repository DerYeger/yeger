import type { MapOptions } from 'leaflet'
import L from 'leaflet'
import type { FC } from 'react'
import type { MapContainerProps } from 'react-leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

L.Marker.prototype.options.icon = L.icon({
  iconUrl: '/leaflet-images/map-marker.svg',
  iconRetinaUrl: '/leaflet-images/map-marker.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  shadowUrl: '/leaflet-images/marker-shadow.png',
  shadowRetinaUrl: '/leaflet-images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
})

const boundsPadding = 0.01

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
      minZoom={11}
      maxZoom={20}
      maxBounds={[
        [48.117668 - boundsPadding, 16.18218 - boundsPadding],
        [48.322571 + boundsPadding, 16.566511 + boundsPadding],
      ]}
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
