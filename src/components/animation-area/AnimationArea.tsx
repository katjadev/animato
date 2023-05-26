import { FC, memo } from 'react'
import { AnimationGroup } from '@animato/types'
import useScrollObserver from '@animato/hooks/useScrollObserver'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import AnimationElement, { AnimationElementTranslations } from '@animato/components/animation-element/AnimationElement'
import AnimationKeyframes from '../animation-keyframes/AnimationKeyframes'
import styles from './AnimationArea.module.css'

export type AnimationAreaTranslations = AnimationElementTranslations & {}

interface AnimationAreaProps {
  animations: AnimationGroup[];
  className?: string;
  translations: AnimationAreaTranslations;
}

const AnimationArea: FC<AnimationAreaProps> = memo(({
  animations,
  className,
  translations,
}) => {
  const animationListHeight = animations.reduce((prev, element) => prev + element.animations.length + 1, 0)
  const { 
    state: { selectedElementId, timelineWidth }, 
    actions,
  } = useEditorState()
  const { rootRef, scrollPosition } = useScrollObserver({ onChange: actions.setScrollPosition })

  return (
    <div className={`${styles.animationArea} ${className || ''}`}>
      <div className={styles.elements}>
        <div className={styles.elementsScrollable}>
          <div
            style={{
              marginTop: `-${scrollPosition.top}px`,
              height: `${animationListHeight}rem`,
            }}
          >
            {animations.map((element) => (
              <AnimationElement
                key={element.id} 
                element={element}
                selected={element.id === selectedElementId}
                translations={translations}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.animations}>
        <div className={styles.animationsScrollable} ref={rootRef}>
          <div 
            className={styles.animationsInner}
            style={{ 
              width: `${timelineWidth}px`,
              height: `${animationListHeight}rem`,
            }}
          >
            {animations.map((element) => (
              <AnimationKeyframes 
                key={element.id}
                element={element}
                selected={element.id === selectedElementId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

AnimationArea.displayName = 'AnimationArea'

export default AnimationArea
