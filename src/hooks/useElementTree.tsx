import { v4 as uuidv4 } from 'uuid'
import { ALLOWED_SVG_ELEMENTS } from '@animato/constants'
import { ElementTreeNode } from '@animato/types'
import { useEffect, useState } from 'react'

export default function useElementTree(content: string) {
  const [elements, setElements] = useState<ElementTreeNode[]>([])
  
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

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'application/xml')
    const elementTree = buildElementTree(doc.documentElement)
    setElements(elementTree)
  }, [content])

  return { elements }
}
