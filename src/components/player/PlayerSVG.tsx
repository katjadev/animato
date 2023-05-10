import { memo, forwardRef } from 'react'
import styles from './Player.module.css'

interface PlayerSVGProps {
  content: string;
  className?: string;
}

const PlayerSVG = memo(forwardRef<HTMLDivElement, PlayerSVGProps>(({ content, className }, ref) => (
  <div 
    className={`${styles.player} ${className || ''}`}
    ref={ref}
    dangerouslySetInnerHTML={{ __html: content }}
  />
)))

export default PlayerSVG