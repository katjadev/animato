import { FC } from 'react'
import IconButton from '@animato/components/icon-button/IconButton'
import Icon from '@animato/components/icon/Icon';
import styles from './AnimationArea.module.css'

interface AnimationAreaProps {
  projectId: string;
  content: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}

const AnimationArea: FC<AnimationAreaProps> = ({
  projectId,
  content,
  isPlaying,
  onPlay,
  onPause,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.controls}>
          <IconButton
            icon='icon-skip_previous'
            ariaLabel='Play'
          />
          {!isPlaying && (
            <IconButton
              icon='icon-play_arrow'
              ariaLabel='Play'
              onClick={onPlay}
            />
          )}
          {isPlaying && (
            <IconButton
              icon='icon-pause'
              ariaLabel='Pause'
              onClick={onPause}
            />
          )}
          <div className={styles.timer}>
            <span>0</span>:<span>00</span>.<span>00</span>
          </div>
          <IconButton
            icon='icon-repeat'
            ariaLabel='Play'
          />
        </div>
        <div className={styles.elements}>
          <div className={`${styles.element} ${styles.selected}`}>
            <div>circle</div>
            <button
              className={styles.collapseButton}
              onClick={() => {}}
            >
              <Icon icon='icon-arrow_drop_down' />
            </button>
          </div>
          <div className={styles.animationList}>
            <div className={styles.animation}>Position</div>
            <div className={styles.animation}>Color</div>
          </div>
          <div className={styles.element}>
            <div>rect</div>
            <button
              className={styles.collapseButton}
              onClick={() => {}}
            >
              <Icon icon='icon-arrow_drop_down' />
            </button>
          </div>
          <div className={styles.animationList}>
            <div className={styles.animation}>Color</div>
          </div>
          <div className={styles.element}>
            <div>rect</div>
            <button
              className={styles.collapseButton}
              onClick={() => {}}
            >
              <Icon icon='icon-arrow_drop_down' />
            </button>
          </div>
          <div className={styles.animationList}>
            <div className={styles.animation}>Color</div>
            <div className={styles.animation}>Position</div>
            <div className={styles.animation}>Opacity</div>
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.timeline}></div>
        <div className={styles.elements}>
          <div className={`${styles.element} ${styles.selected}`} />
          <div className={styles.animation} />
          <div className={styles.animation} />
          <div className={styles.element} />
          <div className={styles.animation} />
          <div className={styles.element} />
          <div className={styles.animation} />
          <div className={styles.animation} />
          <div className={styles.animation} />
        </div>
      </div>
      <div className={styles.scrollbar}></div>
    </div>
  )
}

export default AnimationArea