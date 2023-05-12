import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ScrollPosition } from '@animato/types'
import { MAX_DURATION, REM_TO_PX_COEFFICIENT } from '@animato/constants';
import styles from './TimelinePointer.module.css'

interface TimelinePointerProps {
  currentTime: number;
  currentPosition: number;
  scrollPosition: ScrollPosition;
  markSize: number;
  timelineWidth: number;
  onChangePosition: (position: number) => void;
}

const TimelinePointer: FC<TimelinePointerProps> = ({
  currentTime,
  currentPosition,
  scrollPosition,
  markSize,
  timelineWidth,
  onChangePosition, 
}) => {
  const t = useTranslations('project.timeline')
  const pointerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const initialPosition = useMemo(() => pointerRef.current?.getBoundingClientRect().x || 0, [pointerRef.current])

  const handleMouseDown = () => setIsDragging(true)

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!isDragging) {
      return
    }

    const newPosition = Math.max(event.clientX - initialPosition + scrollPosition.left, 0)
    onChangePosition(newPosition)
  }, [
    isDragging, 
    initialPosition,
    scrollPosition.left,
    onChangePosition,
  ])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault()
      event.stopPropagation()
      const newPosition = Math.min(currentPosition + markSize * REM_TO_PX_COEFFICIENT, timelineWidth)
      onChangePosition(newPosition)
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault()
      event.stopPropagation()
      const newPosition = Math.max(currentPosition - markSize * REM_TO_PX_COEFFICIENT, 0)
      onChangePosition(newPosition)
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [
    isDragging, 
    handleMouseMove, 
    handleMouseUp,
  ])

  return (
    <div 
      className={styles.pointer}
      role="slider"
      aria-label={t('pointer-aria-label')}
      aria-valuemin={0}
      aria-valuemax={MAX_DURATION}
      aria-valuenow={currentTime}
      aria-valuetext={t('pointer-aria-valuetext', { time: currentTime })}
      tabIndex={0}
      ref={pointerRef}
      style={{ 
        left: `${currentPosition}px`,
        marginLeft: `-${scrollPosition.left}px`,
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
    />
  )
}

export default TimelinePointer