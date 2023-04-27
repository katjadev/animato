import { FC, useEffect, useRef, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { Project, ScrollPosition } from '@animato/types'
import { useAuth } from '@animato/context/authUserContext'
import { subscribeToProject } from '@animato/pages/api/projects'
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
  const t = useTranslations('project')
  const router = useRouter()
  const authUserContext = useAuth()
  
  const [project, setProject] = useState<Project | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [timelineWidth, setTimelineWidth] = useState(0)
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ left: 0, top: 0 })

  useEffect(() => {
    if (!authUserContext.currentUser && projectId !== 'demo-project') {
      router.push('/')
      return
    }

    if (projectId) {
      subscribeToProject(projectId, authUserContext.currentUser, setProject)
    }
  }, [authUserContext, projectId, router])

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
            projectId={project.id} 
            content={project.data}
            onSelectElement={selectElement}
          />
          <Player 
            className={styles.player}
            isPlaying={isPlaying}
            content={project.data}
          />
          <Controls
            className={styles.controls}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onChangeTime={setCurrentTime}
            onTogglePlaying={setIsPlaying}            
          />
          <Timeline
            className={styles.timeline}
            currentTime={currentTime}
            scrollPosition={scrollPosition}
            onChangeTime={setCurrentTime}
            onChangeWidth={setTimelineWidth}
          />
          <AnimationArea
            className={styles.animations}
            projectId={project.id}
            content={project.data}
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
) => ({
  props: {
    messages: (await import(`../../messages/${context.locale}.json`)).default,
    projectId: context.params?.id,
  },
})

export default Project