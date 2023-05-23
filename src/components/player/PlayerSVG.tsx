import { memo, forwardRef, useImperativeHandle, useRef } from 'react'
import styles from './Player.module.css'

export type PlayerRef = {
  pauseAnimation: () => void;
  unpauseAnimation: () => void;
  setCurrentTime: (time: number) => void;
}

interface PlayerSVGProps {
  content: string;
  className?: string;
}

const PlayerSVG = memo(forwardRef<PlayerRef, PlayerSVGProps>(({ content, className }, ref) => {
  const innerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => {
    const svg = innerRef.current?.querySelector('svg')

    return {
      pauseAnimation() {
        svg && svg.pauseAnimations && svg.pauseAnimations()
      },
      unpauseAnimation() {
        svg && svg.unpauseAnimations && svg.unpauseAnimations()
      },
      setCurrentTime(time: number) {
        svg && svg.setCurrentTime && svg.setCurrentTime(time)
      },
    }
  }, [])

  return (
    <div 
      className={`${styles.player} ${className || ''}`}
      ref={innerRef}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}))

export default PlayerSVG