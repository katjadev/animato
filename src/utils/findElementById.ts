import { ElementTreeNode } from '@animato/types'

export default function findElementById(id: string, tree: ElementTreeNode[]): ElementTreeNode | null {
  for (let root of tree) {
    if (root.id === id) {
      return root
    }
  
    const foundElement: ElementTreeNode | null = findElementById(id, root.children)
    if (foundElement) {
      return foundElement
    }
  }

  return null
}