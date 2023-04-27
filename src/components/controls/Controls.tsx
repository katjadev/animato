import { FC, useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import moment from 'moment'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from './Controls.module.css'

interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  className?: string;
  onChangeTime: (newTime: number) => void;
  onTogglePlaying: (isPlaying: boolean) => void;
}

const Controls: FC<ControlsProps> = ({
  isPlaying,
  currentTime,
  className,
  onChangeTime,
  onTogglePlaying,
}) => {
  const t = useTranslations('project-controls')

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

  return (
    <div className={`${styles.controls} ${className}`}>
      <IconButton
        ariaLabel={t('restart')}
        disabled={currentTime === 0}
        onClick={handleRestart}
      >
        <Icon icon='skip-prev' />
      </IconButton>
      {!isPlaying && (
        <IconButton
          ariaLabel={t('play')}
          onClick={handlePlay}
        >
          <Icon icon='play' />
        </IconButton>
      )}
      {isPlaying && (
        <IconButton
          ariaLabel={t('pause')}
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
      <IconButton ariaLabel={t('repeat')}>
        <Icon icon='repeat' />
      </IconButton>
    </div>
  )
}

export default Controls