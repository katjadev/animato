import { useCallback, useEffect, useRef, useState } from 'react'

export default function useCustomScrollbar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollbarRef = useRef<HTMLDivElement>(null)
  const observer = useRef<ResizeObserver | null>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [scrollbarWidth, setScrollbarWidth] = useState(20)
  const [scrollStartPosition, setScrollStartPosition] = useState(0)
  const [currentScroll, setCurrentScroll] = useState(0)
  const [scrollbarMargin, setScrollbarMargin] = useState(0)

  function handleResize() {
    if (!containerRef.current || !contentRef.current || !scrollbarRef.current) {
      return
    }

    const containerWidth = containerRef.current.clientWidth
    const contentWidth = contentRef.current.clientWidth

    const width = Math.max((containerWidth / contentWidth) * containerWidth, 20)
    setScrollbarWidth(width)

    if (width < containerWidth) {
      scrollbarRef.current.style.display = 'block'
      scrollbarRef.current.style.width = `${width}px`
    } else {
      scrollbarRef.current.style.display = 'none'
    }
  }

  useEffect(() => {
    if (contentRef.current) {
      const ref = contentRef.current;
      observer.current = new ResizeObserver(() => {
        handleResize();
      });
      observer.current.observe(ref);
      return () => {
        observer.current?.unobserve(ref);
      };
    }
  }, []);

  useEffect(() => {
    if (scrollbarRef.current) {
      scrollbarRef.current.style.marginLeft = `${scrollbarMargin}px`
    }
  }, [scrollbarMargin]);

  const handleThumbMouseDown = useCallback((event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setScrollStartPosition(event.clientX)
    setIsDragging(true)
  }, [])
  
  const handleThumbMouseUp = useCallback((event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (isDragging && scrollbarRef.current) {
      setIsDragging(false)
      setScrollbarMargin(scrollbarRef.current.style.marginLeft ? parseInt(scrollbarRef.current.style.marginLeft) : 0)
    }
  }, [isDragging])
  
  const handleThumbMouseMove = useCallback((event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (!isDragging || !contentRef.current || !containerRef.current || !scrollbarRef.current) {
      return
    }
    
    const containerWidth = containerRef.current.offsetWidth
    const contentWidth = contentRef.current.offsetWidth

    const deltaY = (event.clientX - scrollStartPosition) * (containerWidth / scrollbarWidth)
    const scroll = currentScroll + deltaY

    if (scroll >= 0 && scroll <= contentWidth - containerWidth) {
      setCurrentScroll(scroll)
      contentRef.current.style.marginLeft = `-${scroll}px`
      scrollbarRef.current.style.marginLeft = `${scrollbarMargin + (event.clientX - scrollStartPosition)}px`
    } else if (scroll < 0) {
      contentRef.current.style.marginLeft = '0px'
      scrollbarRef.current.style.marginLeft = '0px'
    }
  }, [
    isDragging, 
    scrollStartPosition, 
    scrollbarWidth, 
    scrollbarMargin,
    currentScroll,
  ])

  useEffect(() => {
    if (!scrollbarRef.current) {
      return
    }

    const scrollbarElement = scrollbarRef.current
    document.addEventListener('mousemove', handleThumbMouseMove)
    document.addEventListener('mouseup', handleThumbMouseUp)
    document.addEventListener('mouseleave', handleThumbMouseUp)
    scrollbarElement.addEventListener('mousedown', handleThumbMouseDown)

    return () => {
      document.removeEventListener('mousemove', handleThumbMouseMove)
      document.removeEventListener('mouseup', handleThumbMouseUp)
      document.removeEventListener('mouseleave', handleThumbMouseUp)
      scrollbarElement?.removeEventListener('mousedown', handleThumbMouseDown)
    }
  })

  return { 
    containerRef, 
    contentRef, 
    scrollbarRef,
  }
}