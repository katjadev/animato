import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { 
  MAX_DURATION, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { ScrollPosition, TimelineMark } from '@animato/types'
import useTimelineMarks from '@animato/hooks/useTimelineMarks'
import TimelinePointer from '../timeline-pointer/TimelinePointer'
import styles from './Timeline.module.css'

const MAX_ZOOM = 60
const MIN_ZOOM = 10

const findClosestMark = (marks: TimelineMark[], position: number): TimelineMark => {
  return marks.reduce(function(prev, current) {
    return (Math.abs(current.position - position) < Math.abs(prev.position - position)
      ? current 
      : prev)
  })
}

interface TimelineProps {
  currentTime: number;
  scrollPosition: ScrollPosition;
  className?: string;
  onChangeTime: (timeMillis: number) => void;
  onChangeWidth: (width: number) => void;
}

const Timeline: FC<TimelineProps> = ({
  currentTime,
  scrollPosition,
  className,
  onChangeTime,
  onChangeWidth,
}) => {
  const timelineRef = useRef<SVGSVGElement>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const [zoom, setZoom] = useState(MAX_ZOOM)
  const [currentPointerPosition, setCurrentPointerPosition] = useState(0)
  const [timelineWidth, setTimelineWidth] = useState(0)
  const { marks, markSize } = useTimelineMarks(zoom)
  const timelinePaddingPx = TIMELINE_PADDING * REM_TO_PX_COEFFICIENT

  useEffect(() => {
    setCurrentPointerPosition((timelineWidth * currentTime) / MAX_DURATION)
  }, [currentTime, marks, markSize])


  useEffect(() => {
    if (timelineRef.current) {
      const ref = timelineRef.current
      observer.current = new ResizeObserver(() => onChangeWidth(ref.getBoundingClientRect().width))
      observer.current.observe(ref)
      return () => {
        observer.current?.unobserve(ref)
      };
    }
  }, [onChangeWidth, timelineRef.current])

  useEffect(() => {
    setTimelineWidth(marks.length * markSize * REM_TO_PX_COEFFICIENT + 2 * timelinePaddingPx)
  }, [marks, markSize])

  const handleZoom = (event: React.WheelEvent) => {
    if (event.deltaY > 0 && zoom > MIN_ZOOM) { // zoom out
      setZoom(zoom - 1)
    }
    if (event.deltaY < 0 && zoom < MAX_ZOOM) { // zoom in
      setZoom(zoom + 1)
    }
  }

  const handleChangePointerPosition = (position: number) => {
    const closestMark = findClosestMark(marks, position)
    const newTime = Math.round(((closestMark.position * MAX_DURATION) / (timelineWidth * 100))) * 100
    onChangeTime(newTime)
  }

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const timelineLeft = event.currentTarget.getBoundingClientRect().left
    const position = event.clientX - timelineLeft - timelinePaddingPx
    const closestMark = findClosestMark(marks, position)
    const newTime = Math.round((closestMark.position * MAX_DURATION) / timelineWidth)
    onChangeTime(newTime > 0 ? newTime : 0)
  }

  return (
    <div className={`${styles.timeline} ${className}`}>
      <svg 
        width={`${timelineWidth}px`} 
        height={`${3 * REM_TO_PX_COEFFICIENT}px`}
        ref={timelineRef}
        style={{ marginLeft: `-${scrollPosition.left}px` }}
        onWheel={handleZoom}
        onClick={handleClick}
      >
        {marks.map((mark, index) => (
          <Fragment key={index}>
            <line 
              x1={`${mark.position + timelinePaddingPx}px`} 
              y1={`${3 * REM_TO_PX_COEFFICIENT}px`}
              x2={`${mark.position + timelinePaddingPx}px`} 
              y2={`${mark.height}px`} 
              stroke='var(--border-darker)' 
            />
            <text 
              x={`${mark.position + timelinePaddingPx}px`}
              y="12px"
              fontSize="12px"
              textAnchor="middle"
              color='var(--text-base)'
            >
              {mark.title}
            </text>
          </Fragment>
        ))}
      </svg>
      <TimelinePointer
        currentTime={currentTime}
        currentPosition={currentPointerPosition}
        scrollPosition={scrollPosition}
        markSize={markSize}
        timelineWidth={timelineWidth}
        onChangePosition={handleChangePointerPosition} 
      />
    </div>
  )
}

export default Timeline