import { FC, MouseEventHandler } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps {
  children?: React.ReactNode;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const IconButton: FC<IconButtonProps> = ({ 
  children, 
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
      className={`${styles.iconButton} ${className || ''}`} 
      aria-label={ariaLabel}
      aria-disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default IconButton