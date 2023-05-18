'use client'

import { FC, useState } from 'react'
import Header, { HeaderTranslations } from '@animato/components/header/Header'
import ElementTree, { ElementTreeTranslations } from '@animato/components/element-tree/ElementTree'
import { Project, ScrollPosition } from '@animato/types'
import { MAX_ZOOM } from '@animato/constants'
import Player from '@animato/components/player/Player'
import Controls, { ControlsTranslations } from '@animato/components/controls/Controls'
import Timeline, { TimelineTranslations } from '@animato/components/timeline/Timeline'
import AnimationArea from '@animato/components/animation-area/AnimationArea'
import useTimelineMarks from '@animato/hooks/useTimelineMarks'
import useAnimationList from '@animato/hooks/useAnimationList'
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRepeatMode, setIsRepeatMode] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [timelineWidth, setTimelineWidth] = useState(0)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ left: 0, top: 0 })

  const [zoom, setZoom] = useState(MAX_ZOOM)
  const { marks, markSize } = useTimelineMarks(zoom)
  const { animations, duration } = useAnimationList(project?.data || '', marks)

  const selectElement = (id: string | null) => {
    setSelectedElementId(id)
  }
  
  return (
    <>
      <Header 
        title={project.title} 
        className={styles.header} 
        isAuthenticated={isAuthenticated}
        translations={translations}
      />
      <ElementTree 
        className={styles.elements}
        projectId={project.id} 
        content={project.data}
        translations={translations}
        onSelectElement={selectElement}
      />
      <Player 
        className={styles.player}
        isPlaying={isPlaying}
        isRepeatMode={isRepeatMode}
        duration={duration}
        content={project.data}
        currentTime={currentTime}
        onChangeTime={setCurrentTime}
      />
      <Controls
        className={styles.controls}
        isPlaying={isPlaying}
        isRepeatMode={isRepeatMode}
        currentTime={currentTime}
        translations={translations}
        onChangeTime={setCurrentTime}
        onTogglePlaying={setIsPlaying}
        onToggleRepeatMode={setIsRepeatMode}
      />
      <Timeline
        className={styles.timeline}
        zoom={zoom}
        marks={marks}
        markSize={markSize}
        duration={duration}
        isRepeatMode={isRepeatMode}
        currentTime={currentTime}
        scrollPosition={scrollPosition}
        translations={translations}
        onChangeTime={setCurrentTime}
        onChangeWidth={setTimelineWidth}
        onChangeZoom={setZoom}
      />
      <AnimationArea
        className={styles.animations}
        projectId={project.id}
        animations={animations}
        selectedElementId={selectedElementId}
        timelineWidth={timelineWidth}
        onChangeTime={setCurrentTime}
        onScroll={setScrollPosition}
      />
    </>
  )
}

export default Editor