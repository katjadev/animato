import { Children, FC, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Menu.module.css'

interface MenuProps {
  id: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  children?: ReactNode;
  onClose: () => void;
}

const Menu: FC<MenuProps> = ({
  id,
  anchorEl,
  open,
  children,
  onClose,
}) => {
  const [ top, setTop ] = useState(0)
  const [ left, setLeft ] = useState(0)
  const [ currentItemIndex, setCurrentItemIndex ] = useState(0)
  const menuElement = useRef<HTMLDivElement>(null)
  const documentRef = useRef<Element | null>(null)

  useEffect(() => {
    documentRef.current = document.body
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('click', onClose)
    }

    return () => {
      document.removeEventListener('click', onClose)
    }
  }, [open, onClose])

  useEffect(() => {
    if (anchorEl) {
      const { left, bottom } = anchorEl.getBoundingClientRect()
      setTop(bottom)
      setLeft(left)
    }
  }, [anchorEl])

  useEffect(() => {
    if (menuElement.current) {
      const element = Array.from(menuElement.current.querySelectorAll('button, a'))[currentItemIndex]
      if (element) {
        (element as HTMLElement).focus()
      }
    }
  }, [currentItemIndex])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }

    if (event.key === 'ArrowDown') {
      if (currentItemIndex < Children.count(children) - 2) {
        setCurrentItemIndex(currentItemIndex + 1)
      }
    }

    if (event.key === 'ArrowUp') {
      if (currentItemIndex > 0) {
        setCurrentItemIndex(currentItemIndex - 1)
      }
    }

    if (event.key === 'Tab') {
      if (menuElement.current) {
        const activeElement = document?.activeElement
        const menuItems = Array.from(menuElement.current.querySelectorAll('button, a'))
        const focusedIndex = menuItems.findIndex(element => activeElement && element === activeElement)
        
        if (!event.shiftKey && focusedIndex === menuItems.length - 1 || event.shiftKey && focusedIndex === 0) {
          onClose()
        }
      }
    }
  }

  if (!open || !documentRef.current) return null

  return (
    <>
      {createPortal((
        <div 
          className={styles.menu} 
          id={id}
          style={{ top: `${top}px`, left: `${left}px` }}
          ref={menuElement}
          onKeyDown={handleKeyDown}
        >
          <ul className={styles.list} role='menu'>
            {children}
          </ul>
        </div>
      ), documentRef.current)}
    </>
  )
}

export default Menu