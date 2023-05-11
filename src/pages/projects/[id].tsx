import { FC, useEffect, useRef, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { Project, ScrollPosition } from '@animato/types'
import { useAuth } from '@animato/context/authUserContext'
// import { subscribeToProject } from '@animato/pages/api/projects'
import { MAX_ZOOM } from '@animato/constants'
import useTimelineMarks from '@animato/hooks/useTimelineMarks'
import useAnimationList from '@animato/hooks/useAnimationList'
import Head from '@animato/components/head/Head'
import Header from '@animato/components/header/Header'
import ElementTree from '@animato/components/element-tree/ElementTree'
import AnimationArea from '@animato/components/animation-area/AnimationArea'
import Player from '@animato/components/player/Player'
import Controls from '@animato/components/controls/Controls'
import Timeline from '@animato/components/timeline/Timeline'
import styles from '@animato/styles/Project.module.css'

const inter = Inter({ subsets: ['latin'] })

interface ProjectProps {
  projectId?: string;
}

const Project: FC<ProjectProps> = ({ projectId }) => {
  const { currentUser } = useAuth()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const loadProject = async (id: string) => {
      const response = await fetch(`/api/projects?id=${id}`)
      const data = await response.json()
      setProject(data)
    }

    if (projectId) {
      loadProject(projectId)
    }
  }, [currentUser, projectId])

  const [isPlaying, setIsPlaying] = useState(false)
  const [isRepeatMode, setIsRepeatMode] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [timelineWidth, setTimelineWidth] = useState(0)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ left: 0, top: 0 })

  const [zoom, setZoom] = useState(MAX_ZOOM)
  const { marks, markSize } = useTimelineMarks(zoom)
  const { animations, duration } = useAnimationList(project?.data || '', timelineWidth, marks)

  const selectElement = (id: string | null) => {
    setSelectedElementId(id)
  }

  if (project === null) {
    return null
  }

  return(
    <>
      <Head title={project.title} />
      <main className={`${styles.main} ${inter.className}`}>
        <Header title={project.title} className={styles.header} />
          <ElementTree 
            className={styles.elements}
            projectId={projectId!} 
            content={project.data}
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
            onChangeTime={setCurrentTime}
            onChangeWidth={setTimelineWidth}
            onChangeZoom={setZoom}
          />
          <AnimationArea
            className={styles.animations}
            projectId={projectId!}
            animations={animations}
            selectedElementId={selectedElementId}
            timelineWidth={timelineWidth}
            onChangeTime={setCurrentTime}
            onScroll={setScrollPosition}
          />
      </main>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps<{ messages: [] }> = async (
  context
) => {
  return {
    props: {
      messages: (await import(`../../messages/${context.locale}.json`)).default,
      projectId: context.params?.id,
    },
  }
}

export default Project