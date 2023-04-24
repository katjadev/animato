import { FC, useCallback, useEffect, useState } from 'react'
import { TimelineMark } from '@animato/types'
import styles from './TimelinePointer.module.css'
import { MAX_DURATION } from '@animato/constants';

interface TimelinePointerProps {
  currentPosition: number;
  onChangePosition: (position: number) => void;
}

const TimelinePointer: FC<TimelinePointerProps> = ({ 
  currentPosition, 
  onChangePosition, 
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [initialDragStartPosition, setInitialDragStartPosition] = useState(0)

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true)
    setInitialDragStartPosition(event.clientX)
  }

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
    
    const newPosition = currentPosition + (event.clientX - initialDragStartPosition)
    if (newPosition > 0) {
      onChangePosition(newPosition)
    }
  }, [
    isDragging, 
    currentPosition, 
    initialDragStartPosition, 
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
  })

  return (
    <div 
      className={styles.pointer}
      onMouseDown={handleMouseDown}
      style={{ left: `${currentPosition}px` }}
    />
  )
}

export default TimelinePointer