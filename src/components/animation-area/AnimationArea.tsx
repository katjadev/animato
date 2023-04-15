import { FC, Fragment, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { AnimationGroup } from '@animato/types'
import { ALLOWED_ANIMATIONS } from '@animato/constants'
import useCustomHorizontalScrollbar from '@animato/hooks/useCustomHorizontalScrollbar'
import IconButton from '@animato/components/icon-button/IconButton'
import Icon from '@animato/components/icon/Icon'
import Timeline from '@animato/components/timeline/Timeline'
import styles from './AnimationArea.module.css'

interface AnimationAreaProps {
  projectId: string;
  content: string;
  isPlaying: boolean;
  selectedElementId: string | null;
  onPlay: () => void;
  onPause: () => void;
}

const AnimationArea: FC<AnimationAreaProps> = ({
  projectId,
  content,
  isPlaying,
  selectedElementId,
  onPlay,
  onPause,
}) => {
  const timelineRef = useRef<SVGSVGElement>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const [timelineWidth, setTimelineWidth] = useState(0)
  const [currentTimeMillis, setCurrentTimeMillis] = useState(0)

  const [timeMinutes, setTimeMinutes] = useState('00')
  const [timeSeconds, setTimeSeconds] = useState('00')
  const [timeMilliseconds, setTimeMilliseconds] = useState('000')

  const [animations, setAnimations] = useState<AnimationGroup[]>([])

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

  useEffect(() => {
    const momentObject = moment({
      minutes: Math.floor(currentTimeMillis / (1000 * 60)),
      seconds: Math.floor(currentTimeMillis / 1000) % 60,
      milliseconds: currentTimeMillis % 1000,
    })
    setTimeMilliseconds(momentObject.format('SSS'))
    setTimeSeconds(momentObject.format('ss'))
    setTimeMinutes(momentObject.format('mm'))
  }, [currentTimeMillis])

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'application/xml')

    const list: { [key: string]: AnimationGroup } = {}
    const children = doc.querySelectorAll(ALLOWED_ANIMATIONS.join(', '))
    children.forEach((animationElement) => {
      const id = animationElement.getAttribute('xlink:href')?.toString()
      if (!id) {
        return
      }

      const animatedElement = doc.querySelector(id)
      const duration = animationElement.getAttribute('dur')
      const animation = {
        id: animationElement.getAttribute('id') || '',
        title: animationElement.getAttribute('data-title') || '',
        values: animationElement.getAttribute('values')?.split('; ') || [],
        keyTimes: animationElement.getAttribute('keyTimes')?.split('; ') || [],
        duration: duration ? parseInt(duration) : 0,
      }

      if (!list[id]) {
        list[id] = {
          id: id.replace('#', ''),
          title: animatedElement?.getAttribute('data-title') || animatedElement?.tagName || '',
          animations: [animation]
        }
      } else {
        list[id].animations.push(animation)
      }
    })
    setAnimations(Object.values(list))
  }, [content])

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.controls}>
          <IconButton
            icon='icon-skip_previous'
            ariaLabel='Restart'
            disabled={currentTimeMillis === 0}
            onClick={() => setCurrentTimeMillis(0)}
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
            <span>{timeMinutes}</span>:
            <span>{timeSeconds}</span>.
            <span>{timeMilliseconds}</span>
          </div>
          <IconButton
            icon='icon-repeat'
            ariaLabel='Play'
          />
        </div>
        <div className={styles.elements}>
          {animations.map((animatedElement) => (
            <Fragment key={animatedElement.id}>
              <div className={`${styles.element} ${animatedElement.id === selectedElementId ? styles.selected : ''}`}>
                <div>{animatedElement.title}</div>
                <button
                  className={styles.collapseButton}
                  onClick={() => {}}
                >
                  <Icon icon='icon-arrow_drop_down' />
                </button>
              </div>
              <div className={styles.animationList}>
                {animatedElement.animations.map((animation) => (
                  <div 
                    key={animation.id} 
                    className={styles.animation}
                  >
                    {animation.title}
                  </div>
                ))}
              </div>
            </Fragment>
          ))}
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
            <Timeline 
              ref={timelineRef}
              currentTimeMillis={currentTimeMillis}
              onChangeTime={setCurrentTimeMillis}
            />
          </div>
          <div>
            {animations.map((animatedElement) => (
              <Fragment key={animatedElement.id}>
                <div
                  className={`${styles.keyframesEl} ${animatedElement.id === selectedElementId ? styles.selected : ''}`}
                />
                {animatedElement.animations.map((animation) => (
                  <div 
                    key={animation.id} 
                    className={styles.keyframes}
                  >
                    
                  </div>
                ))}
              </Fragment>
            ))}
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
