import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { v4 as uuidv4 } from 'uuid'
import Icon from '@animato/components/icon/Icon';
import styles from './ElementTree.module.css'

type ElementTreeNode = {
  id: string,
  title: string,
  element: Element,
  children: ElementTreeNode[],
}

const ALLOWED_NODES = ['g', 'path', 'rect', 'circle']

interface ElementTreeProps {
  projectId: string;
  content: string;
}

const ElementTree: FC<ElementTreeProps> = ({
  projectId,
  content,
}) => {
  const t = useTranslations('project')
  const [elements, setElements] = useState<ElementTreeNode[]>([])
  const [collapsedNodes, setCollapsedNodes] = useState<string[]>(JSON.parse(localStorage.getItem(`${projectId}-collapsed-elements`) || '[]'))

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'application/xml')
    
    const makeTree = (currentElement: Element): ElementTreeNode[] => {
      const children = Array.from(currentElement.children)
        .filter((element) => ALLOWED_NODES.includes(element.nodeName))

      return children.map((element) => ({
        id: element.getAttribute('id') || uuidv4(),
        element,
        title: element.getAttribute('data-title') || element.nodeName,
        children: makeTree(element),
      }))
    }

    const tree = makeTree(doc.documentElement)
    setElements(tree)
  }, [content])
  
  useEffect(() => {
    localStorage.setItem(`${projectId}-collapsed-elements`, JSON.stringify(collapsedNodes))
  }, [collapsedNodes])

  const toggleNode = (elementId: string): void => {
    if (collapsedNodes.includes(elementId)) {
      setCollapsedNodes(collapsedNodes.filter((id) => id !== elementId))
    } else {
      setCollapsedNodes([...collapsedNodes, elementId])
    }
  }

  const renderTree = (list: ElementTreeNode[]): ReactNode => (
    <>
      {list.map((element: ElementTreeNode) => (
        <div 
          key={element.id} 
          className={styles.treeNode}
        >
          <div className={`${styles.nodeTitle} ${!element.children.length ? styles.lastChild : ''}`}>
            {element.children.length > 0 && (
              <button
                className={styles.collapseButton}
                onClick={() => toggleNode(element.id)}
              >
                <Icon icon={collapsedNodes.includes(element.id) ? 'icon-arrow_right' : 'icon-arrow_drop_down'} />
              </button>
            )}
            <div>{element.title}</div>
          </div>
          {element.children.length > 0 && !collapsedNodes.includes(element.id) && (
            <>{renderTree(element.children)}</>
          )}
        </div>
      ))}
    </>
  )

  return (
    <div className={styles.elements}>
      <h2 className={styles.title}>{t('elements')}</h2>
      {renderTree(elements)}
    </div>
  )
}

export default ElementTree