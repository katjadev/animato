import { ChangeEvent, FC, useState, KeyboardEvent, useRef } from 'react'

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
          onClick={startEditing}
          onFocus={startEditing}
        >
          {value}
        </span>
      )}
    </>
  )
}

export default EditableText