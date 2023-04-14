import { FC, MouseEventHandler } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  icon: string;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({ 
  icon, 
  ariaLabel,
  className,
  disabled,
  onClick,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onClick && onClick(event)
    }
  }

  return (
    <button 
      className={`${icon} ${styles.iconButton} ${className || ''}`} 
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={handleClick}
    ></button>
  )
}

export default IconButton