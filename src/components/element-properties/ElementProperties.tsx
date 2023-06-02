import { ChangeEvent, FC } from 'react'
import findElementById from '@animato/utils/findElementById'
import { useEditorState } from '../../context/EditorContext/EditorContextProvider'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import styles from './ElementProperties.module.css'
import Icon from '../icon/Icon'
import Input from '../input/Input'

export type ElementPropertiesTranslations = {
  properties: string;
}

interface ElementPropertiesProps {
  translations: ElementPropertiesTranslations;
  className?: string;
}

const ElementProperties: FC<ElementPropertiesProps> = ({ translations, className }) => {
  const { state: { elements } } = useProjectState()
  const { state: { selectedElementIds } } = useEditorState()

  if (selectedElementIds.length === 0) {
    return null
  }

  const collapsed = false
  const element = findElementById(selectedElementIds.at(-1) as string, elements)

  if (!element) {
    return null
  }

  return (
    <div className={`${className || ''} ${styles.properties}`}>
      <h2 className={styles.title}>{translations.properties}</h2>
      <section>
        <h3 className={styles.subtitle}>
          ELEMENT PROPERTIES
          <button
            className={styles.collapseButton}
            aria-label={'Collapse'}
            onClick={() => {}}
          >
            {collapsed ? <Icon icon='nav-arrow-right' /> : <Icon icon='nav-arrow-down' />}
          </button>
        </h3>
        <div className={styles.fields}>
          <Input
            className={styles.field}
            type='text'
            id='width'
            name='width'
            label='Width'
            value={element.width}
            onChange={() => {}}
          />
          <Input
            className={styles.field}
            type='text'
            id='height'
            name='height'
            label='Height'
            value={element.height}
            onChange={() => {}}
          />
          <Input
            className={styles.field}
            type='text'
            id='x'
            name='x'
            label='X'
            value={element.x}
            onChange={() => {}}
          />
          <Input
            className={styles.field}
            type='text'
            id='y'
            name='y'
            label='Y'
            value={element.y}
            onChange={() => {}}
          />
        </div>
      </section>
      <section>
        <h3 className={styles.subtitle}>
          STYLING PROPERTIES
          <button
            className={styles.collapseButton}
            aria-label={'Collapse'}
            onClick={() => {}}
          >
            {collapsed ? <Icon icon='nav-arrow-right' /> : <Icon icon='nav-arrow-down' />}
          </button>
        </h3>
      </section>
    </div>
  )
}

export default ElementProperties