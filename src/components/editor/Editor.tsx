'use client'

import { FC } from 'react'
import { AnimationGroup, ElementTreeNode, Project } from '@animato/types'
import { DialogProvider } from '@animato/context/DialogContext/DialogContextProvider'
import Header, { HeaderTranslations } from '@animato/components/header/Header'
import ElementTree, { ElementTreeTranslations } from '@animato/components/element-tree/ElementTree'
import Player from '@animato/components/player/Player'
import Controls, { ControlsTranslations } from '@animato/components/controls/Controls'
import Timeline, { TimelineTranslations } from '@animato/components/timeline/Timeline'
import AnimationArea, { AnimationAreaTranslations } from '@animato/components/animation-area/AnimationArea'
import EditorContextProvider, { useEditorState } from '@animato/context/EditorContext/EditorContextProvider'
import ProjectContextProvider from '@animato/context/ProjectContext/ProjectContextProvider'
import ElementProperties, { ElementPropertiesTranslations } from '../element-properties/ElementProperties'
import styles from './Editor.module.css'

type EditorTranslations = HeaderTranslations & 
  ElementTreeTranslations & 
  ControlsTranslations &
  TimelineTranslations &
  AnimationAreaTranslations & 
  ElementPropertiesTranslations & {}

interface EditorProps {
  project: Project;
  elements: ElementTreeNode[];
  animations: AnimationGroup[];
  duration: number;
  isAuthenticated: boolean;
  translations: EditorTranslations;
}

const EditorComponent: FC<EditorProps> = ({ 
  animations, 
  duration, 
  isAuthenticated, 
  translations,
}) => {
  const { state: { selectedElementIds } } = useEditorState()

  return (
    <>
      <Header 
        className={styles.header} 
        isAuthenticated={isAuthenticated}
        translations={translations}
      />
      <ElementTree 
        className={styles.elements}
        translations={translations}
      />
      <Player 
        className={`${styles.player} ${selectedElementIds.length > 0 ? styles.narrow : ''}`}
      />
      <Controls
        className={styles.controls}
        translations={translations}
      />
      <Timeline
        className={styles.timeline}
        duration={duration}
        translations={translations}
      />
      <AnimationArea
        className={styles.animations}
        animations={animations}
        translations={translations}
      />
      {selectedElementIds.length > 0 && (
        <ElementProperties
          className={styles.properties}
          translations={translations}
        />
      )}
    </>
  )
}

export default function Editor(props: EditorProps) {
  return (
    <ProjectContextProvider 
      project={props.project}
      elements={props.elements} 
      animations={props.animations} 
      duration={props.duration}
    >
      <EditorContextProvider>
        <DialogProvider>
          <EditorComponent {...props} />
        </DialogProvider>
      </EditorContextProvider>
    </ProjectContextProvider>
  )
}
