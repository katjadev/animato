import { FC, useEffect, useRef } from 'react'
import { useEditorState } from '@animato/components/editor/EditorContextProvider'
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
  const { isPlaying, isRepeatMode, currentTime } = state
  const currentTimeRef = useRef(currentTime)

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

  return (
    <PlayerSVG 
      className={className}
      ref={playerRef}
      content={content}
    />
  )
}

export default Player