import { FC } from 'react'
import { ElementTreeNode } from '@animato/types'
import { useEditorState } from '@animato/components/editor/EditorContextProvider'
import Icon from '@animato/components/icon/Icon'
import styles from './ElementTreeItem.module.css'

export type ElementTreeItemTranslations = {
  expand: string;
  collapse: string;
}

interface ElementTreeItemProps {
  element: ElementTreeNode;
  level: number;
  selected: boolean;
  translations: ElementTreeItemTranslations;
}

const ElementTreeItem: FC<ElementTreeItemProps> = ({
  element, 
  level, 
  selected, 
  translations,
}) => {
  const { state, actions } = useEditorState()
  const { collapsedElements } = state

  const isCollapsed = collapsedElements.includes(element.id)

  const select = () => actions.selectElement({ id: element.id })
  const deselect = () => actions.selectElement({ id: null })
  const collapse = () => actions.collapseElement({ id: element.id })
  const expand = () => actions.expandElement({ id: element.id })

  return (
    <div 
      className={`${styles.title} ${selected ? styles.selected :''}`} 
      tabIndex={0}
      onMouseEnter={select}
      onMouseLeave={deselect}
      onFocus={select}
      onBlur={deselect}
    >
      <div className={`${styles.titleIn} ${styles[`level${level}`]}`}>
        {element.children.length > 0 && (
          <>
            {isCollapsed ? (
              <button
                className={styles.collapseButton}
                aria-label={translations.expand}
                onClick={expand}
              >
                <Icon icon='nav-arrow-right' />
              </button>
            ) : (
              <button
                className={styles.collapseButton}
                aria-label={translations.collapse}
                onClick={collapse}
              >
                <Icon icon='nav-arrow-down' />
              </button>
            )}
          </>
        )}
        <div>{element.title}</div>
      </div>
    </div>
  )
}

export default ElementTreeItem