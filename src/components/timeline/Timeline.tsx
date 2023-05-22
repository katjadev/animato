import { FC, Fragment, useCallback, useEffect, useRef } from 'react'
import { 
  MAX_DURATION, 
  MAX_ZOOM, 
  MIN_ZOOM, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { ScrollPosition, TimelineMark } from '@animato/types'
import TimelinePointer, { TimelinePointerTranslations } from '@animato/components/timeline-pointer/TimelinePointer'
import styles from './Timeline.module.css'
import { useEditorState } from '../editor/EditorContextProvider'

const findClosestMark = (marks: TimelineMark[], time: number): TimelineMark => {
  return marks.reduce(function(prev, current) {
    return (Math.abs(current.time - time) < Math.abs(prev.time - time)
      ? current 
      : prev)
  }, { title: '', height: 0, position: 0, time: 0 })
}

export type TimelineTranslations = TimelinePointerTranslations & {}

interface TimelineProps {
  duration: number;
  translations: TimelineTranslations;
  className?: string;
}

const Timeline: FC<TimelineProps> = ({
  duration,
  translations,
  className,
}) => {
  const { state, actions } = useEditorState()
  const { 
    isRepeatMode, 
    currentTime, 
    scrollPosition,
    zoom,
    timelineMarks,
  } = state

  const timelinePaddingPx = TIMELINE_PADDING * REM_TO_PX_COEFFICIENT
  const timelineRef = useRef<SVGSVGElement>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const markSize = timelineMarks.length > 1 ? timelineMarks[1].position - timelineMarks[0].position : 0
  const timelineWidth = timelineMarks.length * markSize * REM_TO_PX_COEFFICIENT + 2 * timelinePaddingPx
  const currentPointerPosition = findClosestMark(timelineMarks, currentTime).position + 0.5 * REM_TO_PX_COEFFICIENT
  const durationMarkPosition = findClosestMark(timelineMarks, duration * 1000).position + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT

  useEffect(() => {
    if (timelineRef.current) {
      const ref = timelineRef.current
      observer.current = new ResizeObserver(() => actions.setTimelineWidth({ width: ref.getBoundingClientRect().width }))
      observer.current.observe(ref)
      return () => {
        observer.current?.unobserve(ref)
      };
    }
  }, [actions.setTimelineWidth])

  const handleZoom = (event: React.WheelEvent) => {
    if (event.deltaY > 0 && zoom > MIN_ZOOM) {
      actions.setZoom({ value: zoom - 1 })
    }
    if (event.deltaY < 0 && zoom < MAX_ZOOM) {
      actions.setZoom({ value: zoom + 1 })
    }
  }

  const handleChangePointerPosition = useCallback((position: number) => {
    const newTime = Math.round(((position * MAX_DURATION) / (timelineWidth * 100))) * 100
    const closestMark = findClosestMark(timelineMarks, newTime)
    actions.setCurrentTime({ time: closestMark.time })
  }, [timelineMarks, timelineWidth, actions.setCurrentTime])

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const timelineLeft = event.currentTarget.getBoundingClientRect().left
    const position = event.clientX - timelineLeft - timelinePaddingPx
    const newTime = Math.round((position * MAX_DURATION) / timelineWidth)
    const closestMark = findClosestMark(timelineMarks, newTime)
    actions.setCurrentTime({ time: closestMark.time })
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
        {timelineMarks.map((mark, index) => (
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
        translations={translations}
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