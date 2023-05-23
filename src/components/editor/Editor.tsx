'use client'

import { FC } from 'react'
import Header, { HeaderTranslations } from '@animato/components/header/Header'
import ElementTree, { ElementTreeTranslations } from '@animato/components/element-tree/ElementTree'
import { AnimationGroup, ElementTreeNode, Project } from '@animato/types'
import Player from '@animato/components/player/Player'
import Controls, { ControlsTranslations } from '@animato/components/controls/Controls'
import Timeline, { TimelineTranslations } from '@animato/components/timeline/Timeline'
import AnimationArea, { AnimationAreaTranslations } from '@animato/components/animation-area/AnimationArea'
import EditorContextProvider from './EditorContextProvider'
import styles from './Editor.module.css'

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
    <EditorContextProvider>
      <Header 
        title={project.title} 
        className={styles.header} 
        isAuthenticated={isAuthenticated}
        translations={translations}
      />
      <ElementTree 
        className={styles.elements}
        elements={elements}
        translations={translations}
      />
      <Player 
        className={styles.player}
        duration={duration}
        content={project.data}
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
    </EditorContextProvider>
  )
}

export default Editor