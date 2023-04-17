import { FC, forwardRef, useEffect, useState } from 'react'
import { MAX_DURATION, REM_TO_PX_COEFFICIENT, TIMELINE_PADDING } from '@animato/constants'
import { TimelineMark } from '@animato/types'
import TimelinePointer from '../timeline-pointer/TimelinePointer'
import styles from './Timeline.module.css'

const MAX_ZOOM = 60
const MIN_ZOOM = 10
const MARK_SIZE_BASE = 1
const ZOOM_BREAKPOINTS = [60, 30, 15]

interface TimelineProps {
  ref: any,
  currentTimeMillis: number;
  onZoom?: (level: number) => void;
  onChangeTime: (timeMillis: number) => void;
}

const Timeline: FC<TimelineProps> = forwardRef<SVGSVGElement, TimelineProps>(({
  currentTimeMillis,
  onZoom, 
  onChangeTime, 
}, ref) => {
  const [zoom, setZoom] = useState(MAX_ZOOM)
  const [markSize, setMarkSize] = useState(MARK_SIZE_BASE)
  const [marks, setMarks] = useState<TimelineMark[]>([])
  const [currentBreakpoint, setCurrentBreakpoint] = useState(MAX_ZOOM)
  const [currentPointerPosition, setCurrentPointerPosition] = useState(0)

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
        position: index * markSize + TIMELINE_PADDING,
      })))
    } else if (zoom <= 30) {
      setMarks(Array.from(Array(MAX_DURATION + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index}s` : '',
        height: index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2),
        position: index * markSize + TIMELINE_PADDING,
      })))
    } else {
      setMarks(Array.from(Array(MAX_DURATION * 10 + 1).keys()).map((index) => ({
        title: index % 10 === 0 ? `${index / 10}s` : '',
        height: index % 10 === 0 ? 1 : (index % 5 === 0 ? 1.5 : 2),
        position: index * markSize + TIMELINE_PADDING,
      })))
    }

    onZoom && onZoom(zoom)
  }, [zoom, currentBreakpoint, onZoom])

  useEffect(() => {
    const timelineWidth = (marks.length * markSize + TIMELINE_PADDING * 2) * REM_TO_PX_COEFFICIENT
    setCurrentPointerPosition((timelineWidth * currentTimeMillis) / (MAX_DURATION * 1000))
  }, [currentTimeMillis, marks, markSize])

  const handleZoom = (event: React.WheelEvent) => {
    if (event.deltaY > 0 && zoom > MIN_ZOOM) { // zoom out
      setZoom(zoom - 1)
    }
    if (event.deltaY < 0 && zoom < MAX_ZOOM) { // zoom in
      setZoom(zoom + 1)
    }
  }

  const handleChangePointerPosition = (position: number) => {
    const timelineWidth = (marks.length * markSize + TIMELINE_PADDING * 2) * REM_TO_PX_COEFFICIENT
    const newTime = Math.round((position * MAX_DURATION * 1000) / timelineWidth)
    onChangeTime(newTime)
  }

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onChangeTime) {}
    const timelineWidth = (marks.length * markSize + TIMELINE_PADDING * 2) * REM_TO_PX_COEFFICIENT
    const timelineLeft = event.currentTarget.getBoundingClientRect().left
    const position = event.clientX - timelineLeft - TIMELINE_PADDING * REM_TO_PX_COEFFICIENT
    const newTime = Math.round((position * MAX_DURATION * 1000) / timelineWidth)
    onChangeTime(newTime > 0 ? newTime : 0)
  }

  return (
    <>
      <svg 
        width={`${marks.length * markSize + TIMELINE_PADDING * 2}rem`} 
        height='3rem'
        ref={ref}
        onWheel={handleZoom}
        onClick={handleClick}
      >
        {marks.map((mark, index) => (
          <g key={index}>
            <line 
              x1={`${mark.position}rem`} 
              y1='3rem' 
              x2={`${mark.position}rem`} 
              y2={`${mark.height}rem`} 
              stroke='var(--border-darker)' 
            />
            <text 
              x={`${mark.position}rem`}
              y="0.8rem"
              fontSize="0.7rem"
              textAnchor="middle"
              color='var(--text-base)'
            >
              {mark.title}
            </text>
          </g>
        ))}
      </svg>
      <TimelinePointer
        currentPosition={currentPointerPosition}
        onChangePosition={handleChangePointerPosition} 
      />
    </>
  )
})

Timeline.displayName = 'Timeline'

export default Timeline