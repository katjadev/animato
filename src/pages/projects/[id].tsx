import { FC, useEffect, useState } from 'react'
import { GetServerSidePropsContext } from 'next'
import { Inter } from 'next/font/google'
import { Project, ScrollPosition } from '@animato/types'
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
import { parseCookies } from 'nookies'
import verifyCookie from '@animato/utils/verifyCookie'

const inter = Inter({ subsets: ['latin'] })

interface ProjectProps {
  projectId?: string;
  authenticated: boolean;
}

const Project: FC<ProjectProps> = ({ projectId, authenticated }) => {
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
  }, [projectId])

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

  if (project === null) {
    return null
  }

  return(
    <>
      <Head title={project.title} />
      <main className={`${styles.main} ${inter.className}`}>
        <Header 
          title={project.title} 
          className={styles.header} 
          authenticated={authenticated} 
        />
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const cookies = parseCookies(context)
  const authentication = await verifyCookie(cookies.user)

  if (!authentication.authenticated && context.params?.id !== 'demo-project') {
    const { res } = context
    res.setHeader('location', '/')
    res.statusCode = 302
    res.end()
  }

  return {
    props: {
      messages: (await import(`../../messages/${context.locale}.json`)).default,
      projectId: context.params?.id,
      ...authentication,
    },
  }
}

export default Project