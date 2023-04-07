import { FC, MouseEventHandler } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  icon: string;
  ariaLabel: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({ 
  icon, 
  ariaLabel,
  className, 
  onClick,
}) => (
  <button 
    className={`${icon} ${styles.iconButton} ${className}`} 
    aria-label={ariaLabel}
    onClick={onClick}
  ></button>
)

export default IconButton