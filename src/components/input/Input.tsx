import { ChangeEventHandler, FC } from 'react'
import styles from './Input.module.css'

interface InputProps {
  type: string;
  id: string;
  name: string;
  value: string;
  label?: string;
  ariaLabel?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const Input: FC<InputProps> = ({
  type,
  id,
  name,
  value,
  label,
  ariaLabel,
  onChange,
}) => (
  <>
    {label && (
      <label 
        className={styles.label} 
        htmlFor={id}
      >
        {label}
      </label>
    )}
    <input 
      type={type} 
      className={styles.input} 
      name={name} 
      id={id} 
      aria-label={ariaLabel}
      value={value}
      onChange={onChange}
    />
  </>
)

export default Input