import { memo, forwardRef, useImperativeHandle, useRef } from 'react'
import { ALLOWED_SVG_ELEMENTS } from '@animato/constants'
import styles from './Player.module.css'

type EventListeners = { 
  onEnter: (ev: Event) => any; 
  onLeave: (ev: Event) => any;
}

export type PlayerRef = {
  pauseAnimation: () => void;
  unpauseAnimation: () => void;
  setCurrentTime: (time: number) => void;
  getElementById: (id: string) => Element | null;
  getElements: () => Element[] | null;
  addEventListeners: (listeners: EventListeners) => void;
  removeEventListeners: (listeners: EventListeners) => void;
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
      getElementById(id: string) {
        return svg?.getElementById(id) || null
      },
      getElements() {
        const elements = svg?.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', '))
        return elements ? Array.from(elements) : null
      },
      addEventListeners({ onEnter, onLeave }: EventListeners) {
        const elements = svg?.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', '))
        elements?.forEach((element) => {
          element.addEventListener('mouseenter', onEnter)
          element.addEventListener('mouseleave', onLeave)
        })
      },
      removeEventListeners({ onEnter, onLeave }: EventListeners) {
        const elements = svg?.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', '))
        elements?.forEach((element) => {
          element.removeEventListener('mouseenter', onEnter)
          element.removeEventListener('mouseleave', onLeave)
        })
      }
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