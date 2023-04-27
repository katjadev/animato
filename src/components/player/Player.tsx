import { FC, useEffect, useRef } from 'react'
import { ALLOWED_SVG_ELEMENTS } from '@animato/constants'
import styles from './Player.module.css'

interface PlayerProps {
  isPlaying: boolean;
  content: string;
  className?: string;
}

const Player: FC<PlayerProps> = ({ 
  isPlaying, 
  content, 
  className,
}) => {
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (playerRef.current) {
      const nodes = playerRef.current.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', '))
      const event = isPlaying ? 'compositionstart' : 'compositionend'
      nodes.forEach((node) => node.dispatchEvent(new CompositionEvent(event)))
    }
  }, [isPlaying])

  return (
    <div 
      className={`${styles.player} ${className}`}
      ref={playerRef}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export default Player