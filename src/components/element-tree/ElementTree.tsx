import { FC, ReactNode } from 'react'
import { ElementTreeNode } from '@animato/types'
import { useEditorState } from '../editor/EditorContextProvider'
import ElementTreeItem, { ElementTreeItemTranslations } from '../element-tree-item/ElementTreeItem'
import styles from './ElementTree.module.css'

export type ElementTreeTranslations = ElementTreeItemTranslations & {
  elements: string;
}

interface ElementTreeProps {
  elements: ElementTreeNode[];
  translations: ElementTreeTranslations;
  className?: string;
}

const ElementTree: FC<ElementTreeProps> = ({
  elements,
  translations,
  className,
}) => {
  const { state } = useEditorState()
  const { collapsedElements } = state
  
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