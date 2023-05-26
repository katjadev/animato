import { FC, useEffect, useState } from 'react'
import moment from 'moment'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import { useEditorState } from '../../context/EditorContext/EditorContextProvider'
import styles from './Controls.module.css'

export type ControlsTranslations = {
  restart: string;
  play: string;
  pause: string;
  repeat: string;
}

interface ControlsProps {
  translations: ControlsTranslations;
  className?: string;
}

const Controls: FC<ControlsProps> = ({ translations, className }) => {
  const [formattedTime, setFormattedTime] = useState({
    minutes: '00',
    seconds: '00',
    milliseconds: '00',
  })
  const { state, actions } = useEditorState()
  const { 
    isPlaying, 
    isRepeatMode, 
    currentTime,
  } = state

  useEffect(() => {
    const momentObject = moment({
      minutes: Math.floor(currentTime / (1000 * 60)),
      seconds: Math.floor(currentTime / 1000) % 60,
      milliseconds: currentTime % 1000,
    })
    setFormattedTime({
      minutes: momentObject.format('mm'),
      seconds: momentObject.format('ss'),
      milliseconds: momentObject.format('SSS'),
    })
  }, [currentTime])
  
  return (
    <div className={`${styles.controls} ${className}`}>
      <IconButton
        aria-label={translations.restart}
        disabled={currentTime === 0}
        onClick={() => actions.setCurrentTime({ value: 0 })}
      >
        <Icon icon='skip-prev' />
      </IconButton>
      {!isPlaying && (
        <IconButton
          aria-label={translations.play}
          onClick={actions.startPlaying}
        >
          <Icon icon='play' />
        </IconButton>
      )}
      {isPlaying && (
        <IconButton
          aria-label={translations.pause}
          onClick={actions.stopPlaying}
        >
          <Icon icon='pause' />
        </IconButton>
      )}
      <div className={styles.timer}>
        <span>{formattedTime.minutes}</span>:
        <span>{formattedTime.seconds}</span>.
        <span>{formattedTime.milliseconds}</span>
      </div>
      <IconButton
        className={isRepeatMode ? styles.activeButton : ''}
        aria-label={translations.repeat}
        onClick={actions.toggleRepeatMode}
      >
        <Icon icon='repeat' />
      </IconButton>
    </div>
  )
}

export default Controls