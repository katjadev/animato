import { FC, useCallback, useDeferredValue, useEffect, useRef } from 'react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import PlayerSVG, { PlayerRef } from './PlayerSVG'

interface PlayerProps {
  className?: string;
}

type StrokeStyle = {
  width: string | null;
  color: string | null;
  dasharray: string | null;
}

const Player: FC<PlayerProps> = ({ className }) => {
  const { state: { duration, data } } = useProjectState()
  const playerRef = useRef<PlayerRef>(null)
  const timeoutRef = useRef<number>(0)
  const { 
    state: { 
      isPlaying,
      isRepeatMode,
      currentTime,
      hoveredElementId,
      selectedElementIds,
    }, 
    actions,
  } = useEditorState()
  const currentTimeRef = useRef(currentTime)
  const prevStrokeStyleRef = useRef<{[key: string]: StrokeStyle}>({})

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

  const playAnimation = useCallback(() => {
    playerRef.current?.unpauseAnimation()
    timeoutRef.current = window.setTimeout(updateCurrentTime, 100)
  }, [])

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
  }, [
    isPlaying,
    isRepeatMode,
    duration,
    playAnimation,
  ])

  useEffect(() => {
    if (!isPlaying) {
      playerRef.current?.setCurrentTime(currentTime / 1000)
    }

    currentTimeRef.current = currentTime
  }, [currentTime, isPlaying])

  const addSelectedHighlight = (element: Element) => {
    prevStrokeStyleRef.current[element.id] = {
      width: element.getAttribute('stroke-width'),
      color: element.getAttribute('stroke'),
      dasharray: element.getAttribute('stroke-dasharray'),
    }
    element.setAttribute('stroke-width', '2px')
    element.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--highlight-2'))
    element.setAttribute('stroke-dasharray', '8')
  }

  const removeSelectedHighlight = (element: Element) => {
    if (prevStrokeStyleRef.current && prevStrokeStyleRef.current[element.id]) {
      const prevStyles = prevStrokeStyleRef.current[element.id]
      if (prevStyles.width) {
        element.setAttribute('stroke-width', prevStyles.width)
      } else {
        element.removeAttribute('stroke-width')
      }

      if (prevStyles.color) {
        element.setAttribute('stroke', prevStyles.color)
      } else {
        element.removeAttribute('stroke')
      }

      if (prevStyles.dasharray) {
        element.setAttribute('stroke-dasharray', prevStyles.dasharray)
      } else {
        element.removeAttribute('stroke-dasharray')
      }
    } else {
      element.removeAttribute('stroke-width')
      element.removeAttribute('stroke')
      element.removeAttribute('stroke-dasharray')
    }
  }

  const handleMouseEnter = useCallback((event: Event) => {
    const { target } = event
    const element = target as Element
    if (element) {
      actions.hoverElement({ id: element.getAttribute('id') })
    }
  }, [actions.hoverElement])

  const handleMouseLeave = useCallback((event: Event) => {
    const { target } = event
    const element = target as Element
    if (element) {
      actions.hoverElement({ id: null })
    }
  }, [actions.hoverElement])

  const handleClick = useCallback((event: Event) => {
    const { target } = event
    const element = target as Element
    element && actions.toggleElement({ id: element.id })
  }, [actions.toggleElement])

  useEffect(() => {
    playerRef.current?.addEventListeners({
      onEnter: handleMouseEnter,
      onLeave: handleMouseLeave,
      onClick: handleClick,
    })

    return () => {
      playerRef.current?.removeEventListeners({
        onEnter: handleMouseEnter,
        onLeave: handleMouseLeave,
        onClick: handleClick,
      })
    }
  }, [data, selectedElementIds])

  useEffect(() => {
    const hoveredElements = Object.keys(prevStrokeStyleRef.current)
    if (hoveredElements.length > 0) {
      hoveredElements.forEach((id) => {
        const element = playerRef.current?.getElementById(id)
        element && removeSelectedHighlight(element)
      })
    }

    if (hoveredElementId) {
      const element = playerRef.current?.getElementById(hoveredElementId)
      element && addSelectedHighlight(element)
    }
  }, [hoveredElementId])

  return (
    <PlayerSVG 
      className={className}
      ref={playerRef}
      content={data}
    />
  )
}

export default Player