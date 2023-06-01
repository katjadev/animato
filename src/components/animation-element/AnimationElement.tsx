import { FC } from 'react'
import { AnimationGroup } from '@animato/types'
import { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import Icon from '@animato/components/icon/Icon'
import styles from './AnimationElement.module.css'

export type AnimationElementTranslations = {
  expand: string;
  collapse: string;
}

interface AnimationElementProps {
  element: AnimationGroup;
  translations: AnimationElementTranslations;
}

const AnimationElement: FC<AnimationElementProps> = ({ element, translations }) => {
  const { state: { collapsedAnimations, selectedElementIds }, actions } = useEditorState()

  const collapsed = collapsedAnimations.includes(element.id)
  const selected = selectedElementIds.includes(element.id)

  const toggleCollapsed = () => {
    if (collapsed) {
      actions.expandAnimation({ id: element.id })
    } else {
      actions.collapseAnimation({ id: element.id })
    }
  }

  return (
    <>
      <div className={`${styles.element} ${selected ? styles.selected : ''}`}>
        <div>{element.title}</div>
        <button
          className={styles.collapseButton}
          aria-label={collapsed ? translations.expand : translations.collapse}
          onClick={toggleCollapsed}
        >
          {collapsed ? <Icon icon='nav-arrow-right' /> : <Icon icon='nav-arrow-down' />}
        </button>
      </div>
      {!collapsed && (
        <div className={styles.animationList}>
          {element.animations.map((animation) => (
            <div 
              key={animation.id} 
              className={styles.animation}
            >
              {animation.title}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AnimationElement