import dynamic from 'next/dynamic'

const LazyMap = dynamic(() => import('./Map'), { ssr: false })

export const LazyMarker = dynamic(async () => await import('./Marker'), { ssr: false })

export const LazyMarkerCluster = dynamic(async () => await import('./MarkerCluster'), {
  ssr: false,
})

export default LazyMap
