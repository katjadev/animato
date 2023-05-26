import { ElementTreeNode } from '@animato/types'

const updateElementById = (tree: ElementTreeNode[], id: string, data: Partial<ElementTreeNode>): ElementTreeNode[] => {
  return tree.map((node: ElementTreeNode) => {
    if (node.id === id) {
      return { ...node, ...data }
    }
    if (node.children && node.children.length > 0) {
      return { ...node, children: updateElementById(node.children, id, data) }
    }
    return node
  })
}

export default updateElementById