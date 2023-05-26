import { ElementTreeNode } from '@animato/types'

const generateProjectData = (
  data: string, 
  elements: ElementTreeNode[],
) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  const width = svg?.getAttribute('width')
  const height = svg?.getAttribute('height')
  const viewBox = svg?.getAttribute('viewBox')
  
  updateElements(doc, elements)

  return `<svg 
    width="${width}" 
    height="${height}" 
    viewBox="${viewBox}" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink">
    ${doc.documentElement.innerHTML}
  </svg>`
}

const updateElements = (doc: Document, tree: ElementTreeNode[]) => {
  tree.forEach((node: ElementTreeNode) => {
    const el = doc.getElementById(node.id)
    el?.setAttribute('data-title', node.title)

    if (node.children && node.children.length > 0) {
      updateElements(doc, node.children)
    }
  })
}

export default generateProjectData