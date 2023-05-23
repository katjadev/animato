import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollPosition } from '@animato/types'

export default function useScrollObserver({
  onChange,
}: {
  onChange: (payload: { value: ScrollPosition }) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ left: 0, top: 0 })

  const handleScroll = useCallback(() => {
    if (rootRef.current) {
      const value = {
        left: rootRef.current.scrollLeft,
        top: rootRef.current.scrollTop,
      }
      setScrollPosition(value)
      onChange({ value })
    }
  }, [onChange])

  useEffect(() => {
    const rootElement = rootRef.current
    rootElement?.addEventListener('scroll', handleScroll)

    return () => {
      rootElement?.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { 
    rootRef,
    scrollPosition,
  }
}