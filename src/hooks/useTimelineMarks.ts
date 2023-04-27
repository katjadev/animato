import { useEffect, useState } from 'react'
import { TimelineMark } from '@animato/types'
import { MAX_DURATION, REM_TO_PX_COEFFICIENT } from '@animato/constants'

const MARK_SIZE_BASE = 1
const ZOOM_BREAKPOINTS = [60, 30, 15]

export default function useTimelineMarks(zoom: number) {
  const [markSize, setMarkSize] = useState(MARK_SIZE_BASE)
  const [marks, setMarks] = useState<TimelineMark[]>([])
  const [currentBreakpoint, setCurrentBreakpoint] = useState(zoom)

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
        height: (index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2)) * REM_TO_PX_COEFFICIENT,
        position: (index * markSize) * REM_TO_PX_COEFFICIENT,
      })))
    } else if (zoom <= 30) {
      setMarks(Array.from(Array(MAX_DURATION + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index}s` : '',
        height: (index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2)) * REM_TO_PX_COEFFICIENT,
        position: (index * markSize) * REM_TO_PX_COEFFICIENT,
      })))
    } else {
      setMarks(Array.from(Array(MAX_DURATION * 10 + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index / 10}s` : '',
        height: (index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2)) * REM_TO_PX_COEFFICIENT,
        position: (index * markSize) * REM_TO_PX_COEFFICIENT,
      })))
    }
  }, [zoom, currentBreakpoint, markSize])

  return { marks, markSize }
}