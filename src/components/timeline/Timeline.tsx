import { FC, Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { 
  MAX_DURATION, 
  MAX_ZOOM, 
  MIN_ZOOM, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { ScrollPosition, TimelineMark } from '@animato/types'
import TimelinePointer from '../timeline-pointer/TimelinePointer'
import styles from './Timeline.module.css'

const findClosestMark = (marks: TimelineMark[], time: number): TimelineMark => {
  return marks.reduce(function(prev, current) {
    return (Math.abs(current.time - time) < Math.abs(prev.time - time)
      ? current 
      : prev)
  }, { title: '', height: 0, position: 0, time: 0 })
}

interface TimelineProps {
  zoom: number;
  marks: TimelineMark[];
  markSize: number;
  duration: number;
  isRepeatMode: boolean;
  currentTime: number;
  scrollPosition: ScrollPosition;
  className?: string;
  onChangeTime: (timeMillis: number) => void;
  onChangeWidth: (width: number) => void;
  onChangeZoom: (zoom: number) => void;
}

const Timeline: FC<TimelineProps> = ({
  zoom,
  marks,
  markSize,
  duration,
  isRepeatMode,
  currentTime,
  scrollPosition,
  className,
  onChangeTime,
  onChangeWidth,
  onChangeZoom,
}) => {
  const timelinePaddingPx = TIMELINE_PADDING * REM_TO_PX_COEFFICIENT
  const timelineRef = useRef<SVGSVGElement>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const timelineWidth = marks.length * markSize * REM_TO_PX_COEFFICIENT + 2 * timelinePaddingPx
  const currentPointerPosition = findClosestMark(marks, currentTime).position + 0.5 * REM_TO_PX_COEFFICIENT
  const durationMarkPosition = findClosestMark(marks, duration * 1000).position + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT
  
  useEffect(() => {
    if (timelineRef.current) {
      const ref = timelineRef.current
      observer.current = new ResizeObserver(() => onChangeWidth(ref.getBoundingClientRect().width))
      observer.current.observe(ref)
      return () => {
        observer.current?.unobserve(ref)
      };
    }
  }, [onChangeWidth])

  const handleZoom = (event: React.WheelEvent) => {
    if (event.deltaY > 0 && zoom > MIN_ZOOM) {
      onChangeZoom(zoom - 1)
    }
    if (event.deltaY < 0 && zoom < MAX_ZOOM) {
      onChangeZoom(zoom + 1)
    }
  }

  const handleChangePointerPosition = useCallback((position: number) => {
    const newTime = Math.round(((position * MAX_DURATION) / (timelineWidth * 100))) * 100
    const closestMark = findClosestMark(marks, newTime)
    onChangeTime(closestMark.time)
  }, [marks, timelineWidth, onChangeTime])

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const timelineLeft = event.currentTarget.getBoundingClientRect().left
    const position = event.clientX - timelineLeft - timelinePaddingPx
    const newTime = Math.round((position * MAX_DURATION) / timelineWidth)
    const closestMark = findClosestMark(marks, newTime)
    onChangeTime(closestMark.time)
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
      <div 
        className={`${styles.durationMark} ${isRepeatMode ? styles.repeatMode : ''}`}
        style={{
          left: `${durationMarkPosition}px`,
          marginLeft: `calc(-${scrollPosition.left}px - 0.5rem)`,
        }}
      />
    </div>
  )
}

export default Timeline