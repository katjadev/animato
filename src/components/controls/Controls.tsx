import { FC, useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from './Controls.module.css'

export type ControlsTranslations = {
  restart: string;
  play: string;
  pause: string;
  repeat: string;
}

interface ControlsProps {
  isPlaying: boolean;
  isRepeatMode: boolean;
  currentTime: number;
  translations: ControlsTranslations;
  className?: string;
  onChangeTime: (newTime: number) => void;
  onTogglePlaying: (isPlaying: boolean) => void;
  onToggleRepeatMode: (isRepeatMode: boolean) => void;
}

const Controls: FC<ControlsProps> = ({
  isPlaying,
  isRepeatMode,
  currentTime,
  translations,
  className,
  onChangeTime,
  onTogglePlaying,
  onToggleRepeatMode,
}) => {
  const [formattedTime, setFormattedTime] = useState({
    minutes: '00',
    seconds: '00',
    milliseconds: '00',
  })

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

  const handleRestart = useCallback(() => onChangeTime(0), [onChangeTime]);
  const handlePlay = useCallback(() => onTogglePlaying(true), [onTogglePlaying]);
  const handlePause = useCallback(() => onTogglePlaying(false), [onTogglePlaying]);
  const handleRepeat = useCallback(() => onToggleRepeatMode(!isRepeatMode), [isRepeatMode, onToggleRepeatMode]);

  return (
    <div className={`${styles.controls} ${className}`}>
      <IconButton
        ariaLabel={translations.restart}
        disabled={currentTime === 0}
        onClick={handleRestart}
      >
        <Icon icon='skip-prev' />
      </IconButton>
      {!isPlaying && (
        <IconButton
          ariaLabel={translations.play}
          onClick={handlePlay}
        >
          <Icon icon='play' />
        </IconButton>
      )}
      {isPlaying && (
        <IconButton
          ariaLabel={translations.pause}
          onClick={handlePause}
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
        ariaLabel={translations.repeat}
        onClick={handleRepeat}
      >
        <Icon icon='repeat' />
      </IconButton>
    </div>
  )
}

export default Controls