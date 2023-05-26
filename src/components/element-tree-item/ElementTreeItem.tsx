import { FC, useState } from 'react'
import { ElementTreeNode } from '@animato/types'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import Icon from '@animato/components/icon/Icon'
import IconButton from '../icon-button/IconButton'
import Menu from '../menu/Menu'
import MenuItem from '../menu-item/MenuItem'
import styles from './ElementTreeItem.module.css'
import EditableText from '../editable-text/EditableText'

const icons: { [key: string]: string } = {
  rect: 'square',
  circle: 'circle',
  g: 'intersect',
  path: '3d-bridge',
}

export type ElementTreeItemTranslations = {
  expand: string;
  collapse: string;
  elementAriaLabel: string;
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
  const { actions: projectActions } = useProjectState()
  const { state, actions: editorActions } = useEditorState()
  const { collapsedElements } = state

  const icon = icons[element.tagName] || 'flare'
  const isCollapsed = collapsedElements.includes(element.id)

  const select = () => editorActions.selectElement({ id: element.id })
  const deselect = () => editorActions.selectElement({ id: null })
  const collapse = () => editorActions.collapseElement({ id: element.id })
  const expand = () => editorActions.expandElement({ id: element.id })

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleRename = (value: string) => {
    projectActions.renameElement({ id: element.id, value })
  }

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
        <Icon className={styles.shapeIcon} icon={icon} />
        <div className={styles.titleText}>
          <EditableText
            value={element.title}
            aria-label={'Rename element'}
            onChange={handleRename}
          />
        </div>
        <IconButton 
          aria-label={translations.elementAriaLabel} 
          size='small'
          onClick={handleClick}
        >
          <Icon icon='more-vert' />
        </IconButton>
        <Menu
          id='element-menu'
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { console.log('!!! animate') }}>
            <Icon icon='bounce-right' />
            Animate
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default ElementTreeItem