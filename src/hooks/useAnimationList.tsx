import { useMemo } from 'react'
import { 
  ALLOWED_ANIMATIONS, 
  ALLOWED_SVG_ELEMENTS, 
  MAX_DURATION, 
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { 
  AnimationGroup, 
  Animation, 
  AnimationKeyframe,
} from '@animato/types'

export default function useAnimationList(content: string, timelineWidth: number) {
  const parser = new DOMParser()
  
  const [animations, duration] = useMemo(() => {
    const doc = parser.parseFromString(content, 'application/xml')
    const elements = Array.from(doc.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', ')))

    return elements.reduce((result: [Array<AnimationGroup>, number], current: Element) => {
      const id = current.getAttribute('id')?.toString()
      if (!id) {
        return result
      }
      
      const title = current?.getAttribute('data-title') || current?.tagName || ''
      const [animationList, currentDuration] = getAnimationsForElement(id, doc, timelineWidth)

      if (animationList.length > 0) {
        result[0] = [...result[0], {
          id,
          title,
          animations: animationList,
        }]
        result[1] = Math.max(result[1], currentDuration)
      }

      return result
    }, [[], 0])
  }, [content, timelineWidth])

  return { animations, duration }
}

const translateKeyTimesToTimelinePoints = (keyTimes: string[], duration: number, timelineWidth: number): AnimationKeyframe[] => keyTimes
      .map((keyTime) => {
        const time = duration * 1000 * parseFloat(keyTime)
        return {
          time,
          position: Math.round((timelineWidth * time) / MAX_DURATION) + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT,
        }
      })

const parseAnimationNode = (node: Element, timelineWidth: number): Animation => {
  const animationDuration = parseInt(node.getAttribute('dur') || '0')
  const keyTimes = (node.getAttribute('keyTimes') || '')
    .split('; ')
    .filter(keyTime => !!keyTime)
  const keyframes = translateKeyTimesToTimelinePoints(keyTimes, animationDuration, timelineWidth)
  
  return {
    id: node.getAttribute('id') || '',
    title: node.getAttribute('data-title') || '',
    values: node.getAttribute('values')?.split('; ') || [],
    keyframes,
    duration: animationDuration,
  }
}

const getAnimationsForElement = (id: string, document: Document, timelineWidth: number): [Animation[], number] => {
  let currentDuration = 0
  const selector = ALLOWED_ANIMATIONS.map((element) => `${element}[*|href="#${id}"]`).join(', ')
  const animations = Array.from(document.querySelectorAll(selector))
    .map((animationNode) => {
      const animation = parseAnimationNode(animationNode, timelineWidth)
      if (currentDuration < animation.duration) {
        currentDuration = animation.duration
      }
      return animation
    })

  return [animations, currentDuration]
}
