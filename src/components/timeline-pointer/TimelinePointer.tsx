import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { ScrollPosition } from '@animato/types'
import { REM_TO_PX_COEFFICIENT } from '@animato/constants';
import styles from './TimelinePointer.module.css'

interface TimelinePointerProps {
  currentPosition: number;
  scrollPosition: ScrollPosition;
  onChangePosition: (position: number) => void;
}

const TimelinePointer: FC<TimelinePointerProps> = ({ 
  currentPosition,
  scrollPosition,
  onChangePosition, 
}) => {
  const pointerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [initialPosition, setInitialPosition] = useState(0)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

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

    const newPosition = Math.max(event.pageX - initialPosition, 0)
    onChangePosition(newPosition)
  }, [
    isDragging, 
    initialPosition, 
    onChangePosition,
  ])

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

  useEffect(() => {
    if (pointerRef.current) {
      setInitialPosition(pointerRef.current.getBoundingClientRect().x)
    }
  }, [])

  return (
    <div 
      className={styles.pointer}
      ref={pointerRef}
      onMouseDown={handleMouseDown}
      style={{ 
        left: `${currentPosition + 0.5 * REM_TO_PX_COEFFICIENT}px`,
        marginLeft: `-${scrollPosition.left}px`,
      }}
    />
  )
}

export default TimelinePointer