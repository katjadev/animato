import { FC, useEffect, useRef } from 'react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import PlayerSVG, { PlayerRef } from './PlayerSVG'

interface PlayerProps {
  duration: number;
  content: string;
  className?: string;
}

const Player: FC<PlayerProps> = ({ 
  duration,
  content, 
  className,
}) => {
  const playerRef = useRef<PlayerRef>(null)
  const timeoutRef = useRef<number>(0)
  const { state, actions } = useEditorState()
  const { isPlaying, isRepeatMode, currentTime, selectedElementId } = state
  const currentTimeRef = useRef(currentTime)
  const prevStrokeStyleRef = useRef<{
    width: string | null;
    color: string | null;
  }>()

  const updateCurrentTime = () => {
    timeoutRef.current = window.setTimeout(updateCurrentTime, 100)

    if (isRepeatMode && currentTimeRef.current === duration * 1000) {
      currentTimeRef.current = 0
      actions.setCurrentTime({ value: 0 })
      playerRef.current?.setCurrentTime(0)
    } else {
      if (currentTimeRef.current === duration * 1000) {
        playerRef.current?.pauseAnimation()
        actions.setCurrentTime({ value: 0 })
        actions.stopPlaying()
      } else {
        currentTimeRef.current = currentTimeRef.current + 100
        actions.setCurrentTime({ value: currentTimeRef.current })
      }
    }
  }

  const playAnimation = () => {
    playerRef.current?.unpauseAnimation()
    timeoutRef.current = window.setTimeout(updateCurrentTime, 100)
  }

  const pauseAnimation = () => {
    playerRef.current?.pauseAnimation()
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = 0
  }

  useEffect(() => {
    if (isPlaying) {
      playAnimation()
    } else {
      pauseAnimation()
    }

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, isRepeatMode, duration, playAnimation])

  useEffect(() => {
    if (!isPlaying) {
      playerRef.current?.setCurrentTime(currentTime / 1000)
    }

    currentTimeRef.current = currentTime
  }, [currentTime, isPlaying])

  const addSelectedHighlight = (element: Element) => {
    prevStrokeStyleRef.current = {
      width: element.getAttribute('stroke-width'),
      color: element.getAttribute('stroke'),
    }
    element.setAttribute('stroke-width', '4')
    element.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--highlight-2'))
  }

  const removeSelectedHighlight = (element: Element) => {
    element.setAttribute('stroke-width', prevStrokeStyleRef.current?.width || '')
    element.setAttribute('stroke', prevStrokeStyleRef.current?.color || '')
  }

  const handleMouseEnter = (event: Event) => {
    const { target } = event
    const element = target as Element
    if (element) {
      actions.selectElement({ id: element.getAttribute('id') })
      addSelectedHighlight(element)
    }
  }

  const handleMouseLeave = (event: Event) => {
    const { target } = event
    const element = target as Element
    if (element) {
      actions.selectElement({ id: null })
      removeSelectedHighlight(element)
    }
  }

  useEffect(() => {
    playerRef.current?.addEventListeners({
      onEnter: handleMouseEnter,
      onLeave: handleMouseLeave,
    })

    return () => {
      playerRef.current?.removeEventListeners({
        onEnter: handleMouseEnter,
        onLeave: handleMouseLeave,
      })
    }
  }, [])

  useEffect(() => {
    const elements = playerRef.current?.getElements()
    elements && elements.forEach(removeSelectedHighlight)

    if (selectedElementId) {
      const element = playerRef.current?.getElementById(selectedElementId)
      element && addSelectedHighlight(element)
    }
  }, [selectedElementId])

  return (
    <PlayerSVG 
      className={className}
      ref={playerRef}
      content={content}
    />
  )
}

export default Player