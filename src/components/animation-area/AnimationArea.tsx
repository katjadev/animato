import { FC, Fragment, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { AnimationGroup, AnimationKeyframe } from '@animato/types'
import { 
  ALLOWED_ANIMATIONS, 
  MAX_DURATION, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import useCustomHorizontalScrollbar from '@animato/hooks/useCustomHorizontalScrollbar'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
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
  const [collapsedAnimations, setCollapsedAnimations] = useState<string[]>(JSON.parse(localStorage.getItem(`${projectId}-collapsed-animations`) || '[]'))

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

    const translateKeyTimesToTimelinePoints = (keyTimes: string[], duration: number): AnimationKeyframe[] => keyTimes
    .map((keyTime) => {
      const time = duration * 1000 * parseFloat(keyTime)
      return {
        time,
        position: Math.round((timelineWidth * time) / (MAX_DURATION * 1000)) + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT,
      }
    })
    
    const list: { [key: string]: AnimationGroup } = {}
    const children = doc.querySelectorAll(ALLOWED_ANIMATIONS.join(', '))
    children.forEach((animationElement) => {
      const id = animationElement.getAttribute('xlink:href')?.toString()
      if (!id) {
        return
      }

      const animatedElement = doc.querySelector(id)
      const duration = parseInt(animationElement.getAttribute('dur') || '0')
      const keyTimes = (animationElement.getAttribute('keyTimes') || '').split('; ').filter(keyTime => !!keyTime)
      const keyframes = translateKeyTimesToTimelinePoints(keyTimes, duration)
      const animation = {
        id: animationElement.getAttribute('id') || '',
        title: animationElement.getAttribute('data-title') || '',
        values: animationElement.getAttribute('values')?.split('; ') || [],
        keyframes,
        duration,
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
  }, [content, timelineWidth])

  useEffect(() => {
    localStorage.setItem(`${projectId}-collapsed-animations`, JSON.stringify(collapsedAnimations))
  }, [collapsedAnimations, projectId])

  const toggleAnimation = (elementId: string): void => {
    if (collapsedAnimations.includes(elementId)) {
      setCollapsedAnimations(collapsedAnimations.filter((id) => id !== elementId))
    } else {
      setCollapsedAnimations([...collapsedAnimations, elementId])
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.controls}>
          <IconButton
            ariaLabel='Restart'
            disabled={currentTimeMillis === 0}
            onClick={() => setCurrentTimeMillis(0)}
          >
            <Icon icon='skip-prev' />
          </IconButton>
          {!isPlaying && (
            <IconButton
              ariaLabel='Play'
              onClick={onPlay}
            >
              <Icon icon='play' />
            </IconButton>
          )}
          {isPlaying && (
            <IconButton
              ariaLabel='Pause'
              onClick={onPause}
            >
              <Icon icon='pause' />
            </IconButton>
          )}
          <div className={styles.timer}>
            <span>{timeMinutes}</span>:
            <span>{timeSeconds}</span>.
            <span>{timeMilliseconds}</span>
          </div>
          <IconButton ariaLabel='Repeat'>
            <Icon icon='repeat' />
          </IconButton>
        </div>
        <div className={styles.elements}>
          {animations.map((animatedElement) => (
            <Fragment key={animatedElement.id}>
              <div className={`${styles.element} ${animatedElement.id === selectedElementId ? styles.selected : ''}`}>
                <div>{animatedElement.title}</div>
                <button
                  className={styles.collapseButton}
                  aria-label={collapsedAnimations.includes(animatedElement.id) ? 'Expand' : 'Collapse'}
                  onClick={() => toggleAnimation(animatedElement.id)}
                >
                  {collapsedAnimations.includes(animatedElement.id) ? <Icon icon='nav-arrow-right' /> : <Icon icon='nav-arrow-down' />}
                </button>
              </div>
              {!collapsedAnimations.includes(animatedElement.id) && (
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
              )}
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
                {!collapsedAnimations.includes(animatedElement.id) && (
                  <>
                    {animatedElement.animations.map((animation) => (
                      <div 
                        key={animation.id} 
                        className={styles.keyframes}
                      >
                        {animation.keyframes.map((keyframe, index) => (
                          <Fragment key={index}>
                            <button 
                              className={styles.keyframe}
                              aria-label={`Keyframe: ${keyframe.time} milliseconds ${index}`}
                              style={{ left: `${keyframe.position}px` }}
                              onClick={() => setCurrentTimeMillis(keyframe.time)}
                            />
                            {index > 0 && (
                              <div 
                                className={styles.keyframeLine}
                                style={{
                                  left: `${animation.keyframes[index - 1].position}px`,
                                  width: `${keyframe.position - animation.keyframes[index - 1].position}px`,
                                }}
                              />
                            )}
                          </Fragment>
                        ))}
                      </div>
                    ))}
                  </>
                )}
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
