import { FC, Fragment, useEffect, useState } from 'react'
import { AnimationGroup, AnimationKeyframe, ScrollPosition } from '@animato/types'
import { 
  ALLOWED_ANIMATIONS, 
  MAX_DURATION, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import useScrollObserver from '@animato/hooks/useScrollObserver'
import Icon from '@animato/components/icon/Icon'
import styles from './AnimationArea.module.css'

interface AnimationAreaProps {
  projectId: string;
  content: string;
  selectedElementId: string | null;
  timelineWidth: number;
  className?: string;
  onChangeTime: (time: number) => void;
  onScroll: (scrollPosition: ScrollPosition) => void;
}

const AnimationArea: FC<AnimationAreaProps> = ({
  projectId,
  content,
  selectedElementId,
  timelineWidth,
  className,
  onChangeTime,
  onScroll,
}) => {
  const [animations, setAnimations ] = useState<AnimationGroup[]>([])
  const [collapsedAnimations, setCollapsedAnimations] = useState<string[]>(JSON.parse(localStorage.getItem(`${projectId}-collapsed-animations`) || '[]'))
  const [animationListHeight, setAnimationListHeight] = useState(0)
  const { rootRef, scrollPosition } = useScrollObserver()

  useEffect(() => {
    onScroll(scrollPosition)
  }, [scrollPosition, onScroll])

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
    Array.from(children)
      .filter((animationElement) => !!animationElement.getAttribute('xlink:href'))
      .forEach((animationElement) => {
        const id = animationElement.getAttribute('xlink:href')!.toString()
        const animatedElement = doc.querySelector(id)
        const duration = parseInt(animationElement.getAttribute('dur') || '0')
        const keyTimes = (animationElement.getAttribute('keyTimes') || '')
          .split('; ')
          .filter(keyTime => !!keyTime)
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

    const animationsList = Object.values(list)
    setAnimationListHeight(animationsList.reduce((prev, element) => prev + element.animations.length + 1, 0))
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
    <div className={`${styles.animationArea} ${className}`}>
      <div className={styles.elements}>
        <div className={styles.elementsScrollable}>
          <div 
            style={{
              marginTop: `-${scrollPosition.top}px`,
              height: `${animationListHeight}rem`,
            }}
          >
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
      </div>
      <div className={styles.animations}>
        <div 
          className={styles.animationsScrollable}
          ref={rootRef}
        >
          <div 
            className={styles.animationsInner}
            style={{ 
              width: `${timelineWidth}px`,
              height: `${animationListHeight}rem`,
            }}
          >
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
                              onClick={() => onChangeTime(keyframe.time)}
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
    </div>
  )
}

export default AnimationArea
