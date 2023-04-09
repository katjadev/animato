import { Children, FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react'
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
  const menuElement = useRef<HTMLDivElement>(null);

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
  }, [currentItemIndex, menuElement.current])

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

  if (!open) return null
  return (
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
      <div className={styles.overlay} onClick={onClose} />
    </div>
  )
}

export default Menu