import { FC, useCallback, useEffect, useRef } from 'react'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import PlayerSVG, { PlayerRef } from './PlayerSVG'

interface PlayerProps {
  className?: string;
}

type StrokeStyle = {
  width: string | null;
  color: string | null;
}

const Player: FC<PlayerProps> = ({ className }) => {
  const { state: { duration, data } } = useProjectState()
  const playerRef = useRef<PlayerRef>(null)
  const timeoutRef = useRef<number>(0)
  const { state, actions } = useEditorState()
  const { isPlaying, isRepeatMode, currentTime, selectedElementId } = state
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
    }
    element.setAttribute('stroke-width', '4')
    element.setAttribute('stroke', getComputedStyle(document.documentElement).getPropertyValue('--highlight-2'))
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
    } else {
      element.removeAttribute('stroke-width')
      element.removeAttribute('stroke')
    }
  }

  const handleMouseEnter = (event: Event) => {
    const { target } = event
    const element = target as Element
    if (element) {
      actions.selectElement({ id: element.getAttribute('id') })
    }
  }

  const handleMouseLeave = (event: Event) => {
    const { target } = event
    const element = target as Element
    if (element) {
      actions.selectElement({ id: null })
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
  }, [data])

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
      content={data}
    />
  )
}

export default Player