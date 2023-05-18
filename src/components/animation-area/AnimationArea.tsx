import { FC, Fragment, memo, useEffect, useState } from 'react'
import { AnimationGroup, ScrollPosition } from '@animato/types'
import useScrollObserver from '@animato/hooks/useScrollObserver'
import Icon from '@animato/components/icon/Icon'
import styles from './AnimationArea.module.css'

interface AnimationAreaProps {
  projectId: string;
  animations: AnimationGroup[];
  selectedElementId: string | null;
  timelineWidth: number;
  className?: string;
  onChangeTime: (time: number) => void;
  onScroll: (scrollPosition: ScrollPosition) => void;
}

const AnimationArea: FC<AnimationAreaProps> = memo(({
  projectId,
  animations,
  selectedElementId,
  timelineWidth,
  className,
  onChangeTime,
  onScroll,
}) => {
  const { rootRef, scrollPosition } = useScrollObserver()

  const [collapsedAnimations, setCollapsedAnimations] = useState<string[]>([])
  const animationListHeight = animations.reduce((prev, element) => prev + element.animations.length + 1, 0)

  useEffect(() => {
    const storedCollapsedAnimations = JSON.parse(localStorage.getItem(`${projectId}-collapsed-animations`) || '[]')
    setCollapsedAnimations(storedCollapsedAnimations)
  }, [projectId])

  useEffect(() => {
    onScroll(scrollPosition)
  }, [scrollPosition, onScroll])

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
                    onClick={() => toggleAnimation(animatedElement.id)}  // TODO: extract into a component
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
})

AnimationArea.displayName = "AnimationArea"

export default AnimationArea
