import { TimelineMark } from '@animato/types'
import { MAX_DURATION, REM_TO_PX_COEFFICIENT } from '@animato/constants'

const MARK_SIZE_BASE = 1
const ZOOM_BREAKPOINTS = [15, 30, 60]

export default function generateTimelineMarks(zoom: number): TimelineMark[] {
  const maxDurationSeconds = Math.round(MAX_DURATION / 1000)
  const currentBreakpoint = ZOOM_BREAKPOINTS
    .reduce((result, current) => {
      if (!result && zoom <= current) {
        result = current
      }
      return result
    }, 0)

  const markSize = ZOOM_BREAKPOINTS.includes(zoom) 
    ? MARK_SIZE_BASE 
    : MARK_SIZE_BASE * (zoom / currentBreakpoint)

  if (zoom <= 15) {
    return Array.from(Array(maxDurationSeconds / 6 + 1).keys()).map((index) => ({
      title: index % 10 === 0 ? `${index / 10}m` : '',
      height: (index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2)) * REM_TO_PX_COEFFICIENT,
      position: Math.round((index * markSize) * REM_TO_PX_COEFFICIENT),
      time: 6000 * index,
    }))
  }

  if (zoom <= 30) {
    return Array.from(Array(maxDurationSeconds + 1).keys()).map((index) => ({
      title: index % 10 === 0 ? `${index}s` : '',
      height: (index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2)) * REM_TO_PX_COEFFICIENT,
      position: Math.round((index * markSize) * REM_TO_PX_COEFFICIENT),
      time: 1000 * index,
    }))
  }

  return Array.from(Array(maxDurationSeconds * 10 + 1).keys()).map((index) => ({
    title: index % 10 === 0 ? `${index / 10}s` : '',
    height: (index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2)) * REM_TO_PX_COEFFICIENT,
    position: Math.round((index * markSize) * REM_TO_PX_COEFFICIENT),
    time: 100 * index,
  }))
}