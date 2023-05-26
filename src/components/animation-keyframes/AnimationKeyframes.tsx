import { FC } from 'react'
import { AnimationGroup } from '@animato/types'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import AnimationKeyframesItem from '@animato/components/animation-keyframes-item/AnimationKeyframesItem'
import styles from './AnimationKeyframes.module.css'

interface AnimationKeyframesProps {
  element: AnimationGroup;
  selected: boolean;
}

const AnimationKeyframes: FC<AnimationKeyframesProps> = ({ element, selected }) => {
  const { state: { collapsedAnimations } } = useEditorState()
  const isCollapsed = collapsedAnimations.includes(element.id)

  return (
    <>
      <div className={`${styles.keyframesEl} ${selected ? styles.selected : ''}`} />
      {!isCollapsed && (
        <>
          {element.animations.map((animation) => (
            <div key={animation.id} className={styles.keyframes}>
              {animation.keyframes.map((keyframe, index) => (
                <AnimationKeyframesItem 
                  key={index}
                  keyframe={keyframe}
                  prevKeyframe={animation.keyframes[index - 1]}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </>
  )
}

export default AnimationKeyframes