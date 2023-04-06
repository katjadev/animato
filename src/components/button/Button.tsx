import { FC, MouseEventHandler } from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'secondary-inverted';
  size: 'large' | 'medium' | 'small';
  className?: string;
  children?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<ButtonProps> = ({
  variant,
  size,
  className,
  children,
  onClick,
}) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button> 
  )
}

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
};

export default Button