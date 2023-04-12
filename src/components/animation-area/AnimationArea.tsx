import { FC, useEffect, useRef, useState } from 'react'
import useCustomHorizontalScrollbar from '@animato/hooks/useCustomHorizontalScrollbar'
import IconButton from '@animato/components/icon-button/IconButton'
import Icon from '@animato/components/icon/Icon';
import Timeline from '@animato/components/timeline/Timeline';
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
  const timelineRef = useRef<SVGSVGElement>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const [timelineWidth, setTimelineWidth] = useState(0)

  const { 
    containerRef, 
    contentRef, 
    scrollbarRef,
  } = useCustomHorizontalScrollbar()

  useEffect(() => {
    if (timelineRef.current) {
      const ref = timelineRef.current;
      observer.current = new ResizeObserver(() => {
        setTimelineWidth(ref.getBoundingClientRect().width)
      });
      observer.current.observe(ref);
      return () => {
        observer.current?.unobserve(ref);
      };
    }
  }, []);

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
      <div 
        className={styles.right} 
        ref={containerRef}
      >
        <div
          className={styles.rightContent}
          ref={contentRef}
          style={{ width: `${timelineWidth}px` }}
        >
          <div className={styles.timeline} >
            <Timeline ref={timelineRef} />
          </div>
          <div>
            <div className={`${styles.keyframesEl} ${styles.selected}`} />
            <div className={styles.keyframes} />
            <div className={styles.keyframes} />
            <div className={styles.keyframesEl} />
            <div className={styles.keyframes} />
            <div className={styles.keyframesEl} />
            <div className={styles.keyframes} />
            <div className={styles.keyframes} />
            <div className={styles.keyframes} />
          </div>
        </div>
      </div>
      <div 
        className={styles.scrollbar}
        ref={scrollbarRef}
      />
    </div>
  )
}

export default AnimationArea
