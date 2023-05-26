import { ChangeEvent, FC, useState, KeyboardEvent, useRef } from 'react'
import styles from './EditableText.module.css'

interface EditableTextProps {
  value: string;
  'aria-label': string;
  onChange: (value: string) => void;
}

const EditableText: FC<EditableTextProps> = ({ value, 'aria-label': ariaLabel, onChange }) => {
  const [isEditing, setIsEditing] = useState(false)
  const prevValueRef = useRef(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const startEditing = () => {
    setIsEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' || event.key === 'Enter') {
      setIsEditing(false)
    }
  }

  const handleInputFocus = () => {
    prevValueRef.current = value
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  return (
    <>
      {isEditing && (
        <input
          className={styles.input}
          ref={inputRef}
          value={value}
          aria-label={ariaLabel}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleBlur}
        />
      )}
      {!isEditing && (
        <span 
          tabIndex={0}
          onDoubleClick={startEditing}
          onFocus={startEditing}
        >
          {value}
        </span>
      )}
    </>
  )
}

export default EditableText