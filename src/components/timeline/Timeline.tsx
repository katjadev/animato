import { FC, useEffect, useState } from 'react'
import { MAX_DURATION } from '@animato/constants'

const PADDING = 0.5
const MAX_ZOOM = 60
const MIN_ZOOM = 10
const MARK_SIZE_BASE = 1
const ZOOM_BREAKPOINTS = [60, 30, 15]

type Mark = {
  title: string,
  height: number,
}

interface TimelineProps {
  onZoom: () => void;
}

const Timeline: FC<TimelineProps> = ({ onZoom }) => {
  const [zoom, setZoom] = useState(MAX_ZOOM)
  const [markSize, setMarkSize] = useState(MARK_SIZE_BASE)
  const [marks, setMarks] = useState<Mark[]>([])
  const [currentBreakpoint, setCurrentBreakpoint] = useState(MAX_ZOOM)

  useEffect(() => {
    if (ZOOM_BREAKPOINTS.includes(zoom)) {
      setMarkSize(MARK_SIZE_BASE)
      setCurrentBreakpoint(zoom)
    } else {
      if (zoom > currentBreakpoint) {
        const currentBreakpointIndex = ZOOM_BREAKPOINTS.findIndex(item => item === currentBreakpoint)
        setCurrentBreakpoint(ZOOM_BREAKPOINTS[currentBreakpointIndex - 1])
      }
      setMarkSize(MARK_SIZE_BASE * (zoom / currentBreakpoint))
    }

    if (zoom <= 15) {
      setMarks(Array.from(Array(MAX_DURATION / 6 + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index / 10}m` : '',
        height: index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2),
      })))
    } else if (zoom <= 30) {
      setMarks(Array.from(Array(MAX_DURATION + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index}s` : '',
        height: index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2),
      })))
    } else {
      setMarks(Array.from(Array(MAX_DURATION * 10 + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index / 10}s` : '',
        height: index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2),
      })))
    }
    onZoom()
  }, [zoom])
  
  const handleZoom = (event: React.WheelEvent) => {
    if (event.deltaY > 0 && zoom > MIN_ZOOM) { // zoom out
      setZoom(zoom - 1)
    }
    if (event.deltaY < 0 && zoom < MAX_ZOOM) { // zoom in
      setZoom(zoom + 1)
    }
  }

  return (
    <svg 
      width={`${marks.length * markSize + PADDING * 2}rem`} 
      height='3rem'
      onWheel={handleZoom}
    >
      {marks.map((mark, index) => {
        const step = index * markSize + PADDING
        
        return (
          <g key={index}>
            <line 
              x1={`${step}rem`} 
              y1='3rem' 
              x2={`${step}rem`} 
              y2={`${mark.height}rem`} 
              stroke='var(--border-darker)' 
            />
            <text 
              x={`${step}rem`}
              y="0.8rem"
              fontSize="0.7rem"
              textAnchor="middle"
              color='var(--text-base)'
            >
              {mark.title}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default Timeline