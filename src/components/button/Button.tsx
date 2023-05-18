import { FC, MouseEventHandler } from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'secondary-inverted';
  size: 'large' | 'medium' | 'small';
  className?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<ButtonProps> = ({
  variant,
  size,
  className,
  children,
  href,
  onClick,
} = {
  variant: 'primary',
  size: 'medium',
}) => {
  if (href) {
    return (
      <Link 
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
        href={href}
      >
        {children}
      </Link> 
    )
  }

  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </button> 
  )
}

export default Button