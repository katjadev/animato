import { 
  ALLOWED_ANIMATIONS, 
  MAX_DURATION, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { AnimationGroup, AnimationKeyframe } from '@animato/types'
import { useEffect, useState } from 'react'

export default function useAnimationList(content: string, timelineWidth: number) {
  const [animations, setAnimations] = useState<AnimationGroup[]>([])
  const [duration, setDuration] = useState(0)

  const translateKeyTimesToTimelinePoints = (keyTimes: string[], duration: number): AnimationKeyframe[] => keyTimes
      .map((keyTime) => {
        const time = duration * 1000 * parseFloat(keyTime)
        return {
          time,
          position: Math.round((timelineWidth * time) / MAX_DURATION) + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT,
        }
      })

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'application/xml')
    const list: { [key: string]: AnimationGroup } = {}
    let animationDuration = 0
    const animationNodes = Array.from(doc.querySelectorAll(ALLOWED_ANIMATIONS.join(', ')))
    
    // TODO: useMemo
    animationNodes
      .filter((animationNode) => !!animationNode.getAttribute('xlink:href'))
      .forEach((animationNode) => {
        const id = animationNode.getAttribute('xlink:href')!.toString()
        const animatedElement = doc.querySelector(id)
        const currentDuration = parseInt(animationNode.getAttribute('dur') || '0')
        const keyTimes = (animationNode.getAttribute('keyTimes') || '')
          .split('; ')
          .filter(keyTime => !!keyTime)
        const keyframes = translateKeyTimesToTimelinePoints(keyTimes, currentDuration)
        const animation = {
          id: animationNode.getAttribute('id') || '',
          title: animationNode.getAttribute('data-title') || '',
          values: animationNode.getAttribute('values')?.split('; ') || [],
          keyframes,
          duration: currentDuration,
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

        if (currentDuration > animationDuration) {
          animationDuration = currentDuration
        }
      })

    setAnimations(Object.values(list))
    setDuration(animationDuration * 1000)
  }, [content, timelineWidth])

  return { animations, duration }
}
