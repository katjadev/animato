import { FC } from 'react'
import { REM_TO_PX_COEFFICIENT, TIMELINE_PADDING } from '@animato/constants'
import findClosestTimelineMark from '@animato/utils/findClosestTimelineMark'
import { useEditorState } from '@animato/components/editor/EditorContextProvider'
import { AnimationKeyframe } from '@animato/types'
import styles from './AnimationKeyframesItem.module.css'

interface AnimationKeyframesItemProps {
  keyframe: AnimationKeyframe;
  prevKeyframe?: AnimationKeyframe;
}

const AnimationKeyframesItem: FC<AnimationKeyframesItemProps> = ({ keyframe, prevKeyframe }) => {
  const { state, actions } = useEditorState()
  const { timelineMarks } = state

  const offset = TIMELINE_PADDING * REM_TO_PX_COEFFICIENT
  const position = findClosestTimelineMark(timelineMarks, keyframe.time).position + offset
  const prevPosition = prevKeyframe 
    ? findClosestTimelineMark(timelineMarks, prevKeyframe.time).position + offset
    : 0
  
  const handleClick = () => actions.setCurrentTime({ time: keyframe.time })

  return (
    <>
      <button 
        className={styles.keyframe}
        aria-label={`Keyframe: ${keyframe.time} milliseconds`}
        style={{ left: `${position}px` }}
        onClick={handleClick}
      />
      {prevKeyframe && (
        <div 
          className={styles.keyframeLine}
          style={{
            left: `${prevPosition}px`,
            width: `${position - prevPosition}px`,
          }}
        />
      )}
    </>
  )
}

export default AnimationKeyframesItem
