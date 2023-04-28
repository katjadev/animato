import { FC, ReactNode, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ElementTreeNode } from '@animato/types'
import useElementTree from '@animato/hooks/useElementTree'
import Icon from '@animato/components/icon/Icon'
import styles from './ElementTree.module.css'

interface ElementTreeProps {
  projectId: string;
  content: string;
  className?: string;
  onSelectElement: (id: string | null) => void;
}

const ElementTree: FC<ElementTreeProps> = ({
  projectId,
  content,
  className,
  onSelectElement,
}) => {
  const t = useTranslations('project')
  const { elements } = useElementTree(content)
  const [collapsedNodes, setCollapsedNodes] = useState<string[]>(JSON.parse(localStorage.getItem(`${projectId}-collapsed-elements`) || '[]'))
  
  useEffect(() => {
    localStorage.setItem(`${projectId}-collapsed-elements`, JSON.stringify(collapsedNodes))
  }, [collapsedNodes, projectId])

  const toggleNode = (elementId: string): void => {
    if (collapsedNodes.includes(elementId)) {
      setCollapsedNodes(collapsedNodes.filter((id) => id !== elementId))
    } else {
      setCollapsedNodes([...collapsedNodes, elementId])
    }
  }

  const handleSelectElement = (id: string | null) => {
    onSelectElement(id)
  }

  const renderTree = (list: ElementTreeNode[], level: number): ReactNode => (
    <>
      {list.map((element: ElementTreeNode) => (
        <div 
          key={element.id} 
          className={styles.treeNode}
        >
          <div 
            className={styles.nodeTitle} 
            tabIndex={0}
            onMouseEnter={() => handleSelectElement(element.id)}
            onMouseLeave={() => handleSelectElement(null)}
            onFocus={() => handleSelectElement(element.id)}
            onBlur={() => handleSelectElement(null)}
          >
            <div className={`${styles.nodeTitleIn} ${styles[`level${level}`]}`}>
              {element.children.length > 0 && (
                <button
                  className={styles.collapseButton}
                  aria-label={collapsedNodes.includes(element.id) ? 'Expand' : 'Collapse'}
                  onClick={() => toggleNode(element.id)}
                >
                  {collapsedNodes.includes(element.id) ? <Icon icon='nav-arrow-right' /> : <Icon icon='nav-arrow-down' />}
                </button>
              )}
              <div>{element.title}</div>
            </div>
          </div>
          {element.children.length > 0 && !collapsedNodes.includes(element.id) && (
            <>{renderTree(element.children, level + 1)}</>
          )}
        </div>
      ))}
    </>
  )

  return (
    <div className={`${className} ${styles.elements}`}>
      <h2 className={styles.title}>{t('elements')}</h2>
      {renderTree(elements, 0)}
    </div>
  )
}

export default ElementTree