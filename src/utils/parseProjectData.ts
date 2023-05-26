import parse from 'html-dom-parser'
import {
  Comment,
  Element,
  ProcessingInstruction,
  Text
} from 'domhandler'
import { v4 as uuidv4 } from 'uuid'
import { ALLOWED_ANIMATIONS, ALLOWED_SVG_ELEMENTS } from '@animato/constants'
import { 
  Animation,
  AnimationGroup,
  AnimationKeyframe,
  ElementTreeNode,
} from '@animato/types'

function isElement(node: Comment | Element | ProcessingInstruction | Text): node is Element {
  return (node as Element).children !== undefined;
}

export default function parseProjectData(data: string): { 
  elements: ElementTreeNode[],
  animations: AnimationGroup[],
  duration: number,
} {
  const doc = parse(data)
  if (doc.length === 0 || !isElement(doc[0])) {
    return { elements: [], animations: [], duration: 0 }
  }

  const elements = buildElementTree(doc[0])
  const allElements = treeToArray(doc[0])
  const animatedElements = allElements.filter(element => element.attribs.id && ALLOWED_SVG_ELEMENTS.includes(element.name))
  const animationElements = allElements.filter(element => ALLOWED_ANIMATIONS.includes(element.name))

  const [animations, duration] = animatedElements.reduce((result: [Array<AnimationGroup>, number], current: Element) => {
    const id = current.attribs.id
    const title = current.attribs['data-title'] || current!.name

    let currentDuration = 0
    const animationList = animationElements
      .filter(item => item.attribs['xlink:href'] === `#${id}`)
      .map((animationNode) => {
        const animation = parseAnimationNode(animationNode)
        if (currentDuration < animation.duration) {
          currentDuration = animation.duration
        }
        return animation
      })

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
  const children = currentElement.children
    .filter((element) => isElement(element as Element))
    .filter((element) =>  ALLOWED_SVG_ELEMENTS.includes((element as Element).name))
    .map((element) => element as Element)

  return children.map((element) => ({
    id: element.attribs.id || uuidv4(),
    title: element.attribs['data-title'] || element.name,
    tagName: element.name,
    children: buildElementTree(element),
  }))
}

const treeToArray = (node: Element, result: Element[] = []): Element[] => {
  result.push(node)
  for (const child of node.children) {
    if (isElement(child as Element)) {
      treeToArray(child as Element, result)
    }
  }
  return result
} 

const translateKeyTimesToTimelinePoints = (
  keyTimes: string[], 
  duration: number,
): AnimationKeyframe[] => keyTimes.map((keyTime) => ({ time: duration * 1000 * parseFloat(keyTime) }))

const parseAnimationNode = (node: Element): Animation => {
  const id = node.attribs.id || uuidv4()
  const title = node.attribs['data-title'] || node.tagName
  const values = node.attribs.values?.split('; ') || []
  const duration = parseInt(node.attribs.dur || '0')
  const keyTimes = (node.attribs.keytimes || '')
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
