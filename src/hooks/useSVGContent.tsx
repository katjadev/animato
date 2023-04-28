import { 
  ALLOWED_ANIMATIONS, 
  MAX_DURATION, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { AnimationGroup, AnimationKeyframe } from '@animato/types'
import { useEffect, useState } from 'react'

export default function useSVGContent(content: string, timelineWidth: number) {
  const [animations, setAnimations ] = useState<AnimationGroup[]>([])
  
  const translateKeyTimesToTimelinePoints = (keyTimes: string[], duration: number): AnimationKeyframe[] => keyTimes
      .map((keyTime) => {
        const time = duration * 1000 * parseFloat(keyTime)
        return {
          time,
          position: Math.round((timelineWidth * time) / (MAX_DURATION * 1000)) + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT,
        }
      })

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'application/xml')
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

    setAnimations(Object.values(list))
  }, [content, timelineWidth])

  return {
    animations,
  }
}