import { FC, ReactNode } from 'react'
import { ElementTreeNode } from '@animato/types'
import { useEditorState } from '../../context/EditorContext/EditorContextProvider'
import ElementTreeItem, { ElementTreeItemTranslations } from '../element-tree-item/ElementTreeItem'
import styles from './ElementTree.module.css'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'

export type ElementTreeTranslations = ElementTreeItemTranslations & {
  elements: string;
}

interface ElementTreeProps {
  translations: ElementTreeTranslations;
  className?: string;
}

const ElementTree: FC<ElementTreeProps> = ({
  translations,
  className,
}) => {
  const { state: { elements } } = useProjectState()
  const { state } = useEditorState()
  const { collapsedElements, selectedElementId } = state
  
  const renderTree = (list: ElementTreeNode[], level: number): ReactNode => (
    <>
      {list.map((element: ElementTreeNode) => (
        <div 
          key={element.id} 
          className={styles.treeNode}
        >
          <ElementTreeItem 
            element={element}
            level={level}
            selected={selectedElementId === element.id}
            translations={translations}
          />
          {element.children.length > 0 && !collapsedElements.includes(element.id) && (
            <>{renderTree(element.children, level + 1)}</>
          )}
        </div>
      ))}
    </>
  )

  return (
    <div className={`${className || ''} ${styles.elements}`}>
      <h2 className={styles.title}>{translations.elements}</h2>
      {renderTree(elements, 0)}
    </div>
  )
}

export default ElementTree