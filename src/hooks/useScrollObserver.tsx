import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollPosition } from '@animato/types'

export default function useScrollObserver() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ left: 0, top: 0 })

  const handleScroll = useCallback(() => {
    if (rootRef.current) {
      setScrollPosition({
        left: rootRef.current.scrollLeft,
        top: rootRef.current.scrollTop,
      })
    }
  }, [])

  useEffect(() => {
    const rootElement = rootRef.current
    rootElement?.addEventListener('scroll', handleScroll)

    return () => {
      rootElement?.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { 
    rootRef,
    scrollPosition,
  }
}