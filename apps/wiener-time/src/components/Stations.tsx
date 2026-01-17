import { useRef } from 'react'
import type { FC } from 'react'
import { ViewportList } from 'react-viewport-list'

import { Station } from './Station'

export const Stations: FC<{
  stations: { name: string; isFavorite?: boolean }[]
}> = ({ stations }) => {
  const ref = useRef(null)
  return (
    <div className="scroll-container" ref={ref}>
      <ViewportList viewportRef={ref} items={stations} itemSize={24} itemMargin={16}>
        {(station) => (
          <div key={station.name} className="mb-4">
            <Station station={station} />
          </div>
        )}
      </ViewportList>
    </div>
  )
}
