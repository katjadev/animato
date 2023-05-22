'use client'

import { FC, useEffect, useState } from 'react'
import Header, { HeaderTranslations } from '@animato/components/header/Header'
import ElementTree, { ElementTreeTranslations } from '@animato/components/element-tree/ElementTree'
import { AnimationGroup, ElementTreeNode, Project, ScrollPosition } from '@animato/types'
import parseProjectData from '@animato/utils/parseProjectData'
import Player from '@animato/components/player/Player'
import Controls, { ControlsTranslations } from '@animato/components/controls/Controls'
import Timeline, { TimelineTranslations } from '@animato/components/timeline/Timeline'
import AnimationArea from '@animato/components/animation-area/AnimationArea'
import EditorContextProvider, { useEditorState } from './EditorContextProvider'
import styles from './Editor.module.css'

type EditorTranslations = HeaderTranslations & 
  ElementTreeTranslations & 
  ControlsTranslations &
  TimelineTranslations

interface EditorProps {
  project: Project;
  isAuthenticated: boolean;
  translations: EditorTranslations;
}

const Editor: FC<EditorProps> = ({ project, isAuthenticated, translations }) => {
  const [elements, setElements] = useState<ElementTreeNode[]>([])
  const [animations, setAnimations] = useState<AnimationGroup[]>([])
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const data = parseProjectData(project.data)
    setElements(data.elements)
    setAnimations(data.animations)
    setDuration(data.duration)
  }, [])

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
      {/*<AnimationArea
        className={styles.animations}
        projectId={project.id}
        animations={animations}
      />*/}
    </EditorContextProvider>
  )
}

export default Editor