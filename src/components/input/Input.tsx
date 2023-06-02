import { ChangeEventHandler, forwardRef, useId } from 'react'
import styles from './Input.module.css'

interface InputProps {
  type: string;
  id: string;
  name: string;
  value: string;
  label?: string;
  error?: string;
  className?: string;
  'aria-label'?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type,
  id,
  name,
  value,
  label,
  error,
  className,
  'aria-label': ariaLabel,
  onChange,
}, ref) => {
  const errorId = useId()
  
  return (
    <div className={className || ''}>
      {label && (
        <label 
          className={styles.label} 
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type} 
        className={styles.input} 
        name={name} 
        id={id} 
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        {...(errorId && { 'aria-describedby': errorId })}
      />
      {error && (
        <output 
          className={styles.error} 
          role='alert' 
          id={errorId}
        >
          {error}
        </output>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input