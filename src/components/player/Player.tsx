import { FC, useEffect, useRef } from 'react'
import { useEditorState } from '@animato/components/editor/EditorContextProvider'
import PlayerSVG from './PlayerSVG'

interface PlayerProps {
  duration: number;
  content: string;
  className?: string;
}

const Player: FC<PlayerProps> = ({ 
  duration,
  content, 
  className,
}) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<number | null>(null)
  const { state, actions } = useEditorState()
  const { isPlaying, isRepeatMode, currentTime } = state
  const currentTimeRef = useRef(currentTime)

  useEffect(() => {
    if (!playerRef.current) return

    if (!isPlaying) {
      const svg = playerRef.current.querySelector('svg')
      svg?.setCurrentTime(currentTime / 1000)
    }

    currentTimeRef.current = currentTime
  }, [currentTime, isPlaying])

  useEffect(() => {
    if (!playerRef.current) return
    
    const svg = playerRef.current.querySelector('svg')
    
    if (isPlaying) {
      svg?.unpauseAnimations()
      intervalRef.current = window.setInterval(() => {
        if (isRepeatMode && currentTimeRef.current === duration * 1000) {
          currentTimeRef.current = 0
          actions.setCurrentTime({ time: 0 })
          svg?.setCurrentTime(0)
        } else {
          currentTimeRef.current = currentTimeRef.current + 100
          actions.setCurrentTime({ time: currentTimeRef.current })
        }
      }, 100)
    } else {
      svg?.pauseAnimations()
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isRepeatMode, duration, actions.setCurrentTime])

  return (
    <PlayerSVG 
      className={className}
      ref={playerRef}
      content={content}
    />
  )
}

export default Player