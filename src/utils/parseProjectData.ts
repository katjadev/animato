import { v4 as uuidv4 } from 'uuid'
import { ALLOWED_ANIMATIONS, ALLOWED_SVG_ELEMENTS } from '@animato/constants'
import { 
  Animation,
  AnimationGroup,
  AnimationKeyframe,
  ElementTreeNode,
} from '@animato/types'

export default function parseProjectData(data: string): { 
  elements: ElementTreeNode[],
  animations: AnimationGroup[],
  duration: number,
} {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'application/xml')
  const elements = buildElementTree(doc.documentElement)

  const animatedElements = Array.from(doc.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', ')))
  const [animations, duration] = animatedElements.reduce((result: [Array<AnimationGroup>, number], current: Element) => {
    const id = current.getAttribute('id')?.toString()
    if (!id) {
      return result
    }
    
    const title = current?.getAttribute('data-title') || current!.tagName
    const [animationList, currentDuration] = getAnimationsForElement(id, doc)

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

  return { elements, animations, duration }
}

const buildElementTree = (currentElement: Element): ElementTreeNode[] => {
  const children = Array.from(currentElement.children)
    .filter((element) => ALLOWED_SVG_ELEMENTS.includes(element.nodeName))

  return children.map((element) => ({
    id: element.getAttribute('id') || uuidv4(),
    element,
    title: element.getAttribute('data-title') || element.nodeName,
    children: buildElementTree(element),
  }))
}

const translateKeyTimesToTimelinePoints = (
  keyTimes: string[], 
  duration: number,
): AnimationKeyframe[] => keyTimes.map((keyTime) => ({ time: duration * 1000 * parseFloat(keyTime) }))

const parseAnimationNode = (node: Element): Animation => {
  const id = node.getAttribute('id') || uuidv4()
  const title = node.getAttribute('data-title') || node.tagName
  const values = node.getAttribute('values')?.split('; ') || []
  const duration = parseInt(node.getAttribute('dur') || '0')
  const keyTimes = (node.getAttribute('keyTimes') || '')
    .split('; ')
    .filter(keyTime => !!keyTime)
  const keyframes = translateKeyTimesToTimelinePoints(keyTimes, duration)

  return {
    id,
    title,
    values,
    keyframes,
    duration,
  }
}

const getAnimationsForElement = (id: string, document: Document): [Animation[], number] => {
  let currentDuration = 0
  const selector = ALLOWED_ANIMATIONS.map((element) => `${element}`).join(', ')
  const animations = Array.from(document.querySelectorAll(selector))
    .filter(item => item.getAttribute('xlink:href') === `#${id}`)
    .map((animationNode) => {
      const animation = parseAnimationNode(animationNode)
      if (currentDuration < animation.duration) {
        currentDuration = animation.duration
      }
      return animation
    })

  return [animations, currentDuration]
}
