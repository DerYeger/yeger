import L from 'leaflet'
import type { FC } from 'react'
import { Marker as BaseMarker } from 'react-leaflet'
import type { MarkerProps } from 'react-leaflet'

import lib from '../lib'

const markerIcon = L.icon({
  iconUrl: '/leaflet-images/map-marker.svg',
  iconRetinaUrl: '/leaflet-images/map-marker.svg',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  shadowUrl: '/leaflet-images/marker-shadow.png',
  shadowRetinaUrl: '/leaflet-images/marker-shadow.png',
  shadowSize: [41, 41],
  shadowAnchor: [12, 41],
})

const Marker: FC<MarkerProps & { position: [number, number] }> = ({
  children,
  position,
  ...rest
}) => {
  return (
    <BaseMarker icon={markerIcon} position={lib.fixCoordinates(position)} {...rest}>
      {children}
    </BaseMarker>
  )
}

export default Marker
