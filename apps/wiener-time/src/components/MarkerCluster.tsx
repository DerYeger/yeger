import { FC, ReactNode } from 'react'
import L from 'leaflet'
// @ts-expect-error Missing typedef
import BaseMarkerCluster from '@changey/react-leaflet-markercluster'

const createClusterCustomIcon = (cluster: any) => {
  return L.divIcon({
    html: `<span>${cluster.getChildCount()}</span>`,
    className:
      'bg-[#e74c3c] bg-opacity-100 text-white font-bold flex items-center justify-center rounded-3xl border-white border-4 border-opacity-50',
    iconSize: L.point(40, 40, true),
  })
}

const MarkerCluster: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BaseMarkerCluster
      iconCreateFunction={createClusterCustomIcon}
      showCoverageOnHover={false}
    >
      {children}
    </BaseMarkerCluster>
  )
}

export default MarkerCluster
