import { FC, useState } from 'react'
import { ElementTreeNode } from '@animato/types'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import Icon from '@animato/components/icon/Icon'
import IconButton from '../icon-button/IconButton'
import Menu from '../menu/Menu'
import MenuItem from '../menu-item/MenuItem'
import EditableText from '../editable-text/EditableText'
import styles from './ElementTreeItem.module.css'

const icons: { [key: string]: string } = {
  rect: 'square',
  circle: 'circle',
  ellipse: 'circle',
  g: 'intersect',
  path: '3d-bridge',
}

export type ElementTreeItemTranslations = {
  expand: string;
  collapse: string;
  elementMenuAriaLabel: string;
}

interface ElementTreeItemProps {
  element: ElementTreeNode;
  level: number;
  translations: ElementTreeItemTranslations;
}

const ElementTreeItem: FC<ElementTreeItemProps> = ({
  element, 
  level, 
  translations,
}) => {
  const { actions: projectActions } = useProjectState()
  const { 
    state: { collapsedElements, hoveredElementId, selectedElementIds }, 
    actions: editorActions,
  } = useEditorState()

  const icon = icons[element.tagName] || 'flare'
  const collapsed = collapsedElements.includes(element.id)
  const hovered = hoveredElementId === element.id
  const selected = selectedElementIds.includes(element.id)

  const onMouseEnter = () => editorActions.hoverElement({ id: element.id })
  const onMouseLeave = () => editorActions.hoverElement({ id: null })
  const collapse = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    editorActions.collapseElement({ id: element.id })
  }
  const expand = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    editorActions.expandElement({ id: element.id })
  }
  const select = () => {
    if (selectedElementIds.includes(element.id)) {
      editorActions.deselectElement({ id: element.id })
    } else {
      editorActions.selectElement({ id: element.id })
    }
  }

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
      className={`${styles.title} ${selected ? styles.selected :''} ${hovered ? styles.hovered :''}`} 
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      onClick={select}
    >
      <div className={`${styles.titleIn} ${styles[`level${level}`]}`}>
        {element.children.length > 0 && (
          <>
            {collapsed ? (
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
          aria-label={translations.elementMenuAriaLabel} 
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
          <MenuItem onClick={() => { console.log('!!! remove') }}>
            <Icon icon='trash' />
            Remove
          </MenuItem>
        </Menu>
      </div>
    </div>
  )
}

export default ElementTreeItem