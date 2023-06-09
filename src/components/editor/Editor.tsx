'use client'

import { FC } from 'react'
import Header, { HeaderTranslations } from '@animato/components/header/Header'
import ElementTree, { ElementTreeTranslations } from '@animato/components/element-tree/ElementTree'
import { AnimationGroup, ElementTreeNode, Project } from '@animato/types'
import Player from '@animato/components/player/Player'
import Controls, { ControlsTranslations } from '@animato/components/controls/Controls'
import Timeline, { TimelineTranslations } from '@animato/components/timeline/Timeline'
import AnimationArea, { AnimationAreaTranslations } from '@animato/components/animation-area/AnimationArea'
import EditorContextProvider from '@animato/context/EditorContext/EditorContextProvider'
import ProjectContextProvider from '@animato/context/ProjectContext/ProjectContextProvider'
import styles from './Editor.module.css'
import { DialogProvider } from '@animato/context/DialogContext/DialogContextProvider'

type EditorTranslations = HeaderTranslations & 
  ElementTreeTranslations & 
  ControlsTranslations &
  TimelineTranslations &
  AnimationAreaTranslations & {}

interface EditorProps {
  project: Project;
  elements: ElementTreeNode[];
  animations: AnimationGroup[];
  duration: number;
  isAuthenticated: boolean;
  translations: EditorTranslations;
}

const Editor: FC<EditorProps> = ({ 
  project, 
  elements, 
  animations, 
  duration, 
  isAuthenticated, 
  translations,
}) => {
  return (
    <ProjectContextProvider 
      project={project}
      elements={elements} 
      animations={animations} 
      duration={duration}
    >
      <EditorContextProvider>
        <DialogProvider>
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
            className={styles.player}
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
        </DialogProvider>
      </EditorContextProvider>
    </ProjectContextProvider>
  )
}

export default Editor