import { FC, Fragment, useCallback } from 'react'
import { 
  MAX_DURATION, 
  MAX_ZOOM, 
  MIN_ZOOM, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import TimelinePointer, { TimelinePointerTranslations } from '@animato/components/timeline-pointer/TimelinePointer'
import styles from './Timeline.module.css'
import { useEditorState } from '../editor/EditorContextProvider'
import findClosestTimelineMark from '@animato/utils/findClosestTimelineMark'

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
  const markSize = timelineMarks[1].position - timelineMarks[0].position
  const timelineWidth = timelineMarks.length * markSize + 2 * timelinePaddingPx
  const currentPointerPosition = findClosestTimelineMark(timelineMarks, currentTime).position + 0.5 * REM_TO_PX_COEFFICIENT
  const durationMarkPosition = findClosestTimelineMark(timelineMarks, duration * 1000).position + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT

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
    const closestMark = findClosestTimelineMark(timelineMarks, newTime)
    actions.setCurrentTime({ value: closestMark.time })
  }, [timelineMarks, timelineWidth, actions.setCurrentTime])

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const timelineLeft = event.currentTarget.getBoundingClientRect().left
    const position = event.clientX - timelineLeft - timelinePaddingPx
    const newTime = Math.round((position * MAX_DURATION) / timelineWidth)
    const closestMark = findClosestTimelineMark(timelineMarks, newTime)
    actions.setCurrentTime({ value: closestMark.time })
  }

  return (
    <div className={`${styles.timeline} ${className}`}>
      <svg
        data-testid='timeline'
        width={`${timelineWidth}px`} 
        height={`${3 * REM_TO_PX_COEFFICIENT}px`}
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
        markSize={markSize}
        timelineWidth={timelineWidth}
        translations={translations}
        onChangePosition={handleChangePointerPosition} 
      />
      <div
        data-testid='timeline-duration-mark'
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