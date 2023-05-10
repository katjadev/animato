import { FC, useEffect, useRef } from 'react'
import styles from './Player.module.css'
import PlayerSVG from './PlayerSVG';

interface PlayerProps {
  isPlaying: boolean;
  isRepeatMode: boolean;
  duration: number;
  content: string;
  currentTime: number;
  className?: string;
  onChangeTime: (time: number) => void;
}

const Player: FC<PlayerProps> = ({ 
  isPlaying,
  isRepeatMode,
  duration,
  content, 
  currentTime,
  className,
  onChangeTime,
}) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<number | null>(null)
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
          onChangeTime(0)
          svg?.setCurrentTime(0)
        } else {
          currentTimeRef.current = currentTimeRef.current + 100
          onChangeTime(currentTimeRef.current)
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
  }, [isPlaying, isRepeatMode, duration, onChangeTime])

  return (
    <PlayerSVG 
      className={className}
      ref={playerRef}
      content={content}
    />
  )
}

export default Player