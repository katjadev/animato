import { FC, useEffect, useRef } from 'react'
import styles from './Player.module.css'

interface PlayerProps {
  isPlaying: boolean;
  content: string;
  currentTime: number;
  className?: string;
  onChangeTime: (time: number) => void;
}

const Player: FC<PlayerProps> = ({ 
  isPlaying, 
  content, 
  currentTime,
  className,
  onChangeTime,
}) => {
  const playerRef = useRef<HTMLDivElement>(null)
  const intervalref = useRef<number | null>(null)
  
  useEffect(() => {
    if (!playerRef.current) return

    const svg = playerRef.current.querySelector('svg')
    svg?.setCurrentTime(currentTime / 1000)
  }, [currentTime])

  useEffect(() => {
    if (!playerRef.current) return
    
    const svg = playerRef.current.querySelector('svg')
    if (isPlaying) {
      svg?.unpauseAnimations()
      intervalref.current = window.setInterval(() => onChangeTime(currentTime + 100), 100)
    } else {
      svg?.pauseAnimations()
      if (intervalref.current) {
        window.clearInterval(intervalref.current)
        intervalref.current = null
      }
    }

    return () => {
      if (intervalref.current !== null) {
        window.clearInterval(intervalref.current)
      }
    }
  }, [isPlaying, currentTime])

  return (
    <div 
      className={`${styles.player} ${className}`}
      ref={playerRef}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default Player