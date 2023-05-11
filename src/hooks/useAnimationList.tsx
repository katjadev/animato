import { useEffect, useState } from 'react'
import { 
  ALLOWED_ANIMATIONS, 
  ALLOWED_SVG_ELEMENTS,
  REM_TO_PX_COEFFICIENT, 
  TIMELINE_PADDING,
} from '@animato/constants'
import { 
  AnimationGroup, 
  Animation, 
  AnimationKeyframe,
  TimelineMark,
} from '@animato/types'

export default function useAnimationList(content: string, marks: TimelineMark[]) {
  const [animations, setAnimations] = useState<AnimationGroup[]>([])
  const [duration, setDuration] = useState(0)
  
  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'application/xml')
    const elements = Array.from(doc.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', ')))

    const [animations, duration] = elements.reduce((result: [Array<AnimationGroup>, number], current: Element) => {
      const id = current.getAttribute('id')?.toString()
      if (!id) {
        return result
      }
      
      const title = current?.getAttribute('data-title') || current?.tagName || ''
      const [animationList, currentDuration] = getAnimationsForElement(id, doc, marks)

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

    setAnimations(animations)
    setDuration(duration)
  }, [content])

  return { animations, duration }
}

const findClosestMark = (marks: TimelineMark[], time: number): TimelineMark => {
  return marks.reduce(function(prev, current) {
    return (Math.abs(current.time - time) < Math.abs(prev.time - time)
      ? current 
      : prev)
  }, { title: '', height: 0, position: 0, time: 0 })
}

const translateKeyTimesToTimelinePoints = (
  keyTimes: string[], 
  duration: number,
  marks: TimelineMark[]
): AnimationKeyframe[] => keyTimes
      .map((keyTime) => {
        const time = duration * 1000 * parseFloat(keyTime)
        const closestMark = findClosestMark(marks, time)

        return {
          time,
          position: closestMark.position + TIMELINE_PADDING * REM_TO_PX_COEFFICIENT,
        }
      })

const parseAnimationNode = (node: Element, marks: TimelineMark[]): Animation => {
  const animationDuration = parseInt(node.getAttribute('dur') || '0')
  const keyTimes = (node.getAttribute('keyTimes') || '')
    .split('; ')
    .filter(keyTime => !!keyTime)
  const keyframes = translateKeyTimesToTimelinePoints(keyTimes, animationDuration, marks)

  return {
    id: node.getAttribute('id') || '',
    title: node.getAttribute('data-title') || '',
    values: node.getAttribute('values')?.split('; ') || [],
    keyframes,
    duration: animationDuration,
  }
}

const getAnimationsForElement = (id: string, document: Document, marks: TimelineMark[]): [Animation[], number] => {
  let currentDuration = 0
  const selector = ALLOWED_ANIMATIONS.map((element) => `${element}[*|href="#${id}"]`).join(', ')
  const animations = Array.from(document.querySelectorAll(selector))
    .map((animationNode) => {
      const animation = parseAnimationNode(animationNode, marks)
      if (currentDuration < animation.duration) {
        currentDuration = animation.duration
      }
      return animation
    })

  return [animations, currentDuration]
}
