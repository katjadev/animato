import { FC, useEffect, useRef, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { Project } from '@animato/types'
import { ALLOWED_SVG_ELEMENTS } from '@animato/constants';
import { useAuth } from '@animato/context/authUserContext'
import { subscribeToProject } from '@animato/pages/api/projects'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import ElementTree from '@animato/components/element-tree/ElementTree'
import AnimationArea from '@animato/components/animation-area/AnimationArea'
import styles from '@animato/styles/Project.module.css'

const inter = Inter({ subsets: ['latin'] })

interface ProjectProps {
  projectId?: string;
}

const Project: FC<ProjectProps> = ({ projectId }) => {
  const t = useTranslations('project')
  const router = useRouter()
  const authUserContext = useAuth()
  const previewRef = useRef<HTMLDivElement>(null)
  
  const [project, setProject] = useState<Project | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)

  useEffect(() => {
    if (!authUserContext.currentUser && projectId !== 'demo-project') {
      router.push('/')
      return
    }

    if (projectId) {
      subscribeToProject(projectId, authUserContext.currentUser, setProject)
    }
  }, [authUserContext, projectId, router])

  const play = () => {
    setIsPlaying(true)
    if (previewRef.current) {
      const nodes = previewRef.current.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', '))
      nodes.forEach((node) => node.dispatchEvent(new CompositionEvent('compositionstart')))
    }
  }

  const pause = () => {
    setIsPlaying(false)
    if (previewRef.current) {
      const nodes = previewRef.current.querySelectorAll(ALLOWED_SVG_ELEMENTS.join(', '))
      nodes.forEach((node) => node.dispatchEvent(new CompositionEvent('compositionend')))
    }
  }

  const selectElement = (id: string | null) => {
    setSelectedElementId(id)
  }

  return(
    <>
      <Head title={project?.title || 'Animato'} />
      <main className={`${styles.main} ${inter.className}`}>
        {project !== null && (
          <>
            <header className={styles.header}>
              <div className={styles.left}>
                <Logo variant='compact' />
                <IconButton ariaLabel={t('undo')}><Icon icon='undo' /></IconButton>
                <IconButton ariaLabel={t('redo')}><Icon icon='redo' /></IconButton>
              </div>
              <h1 className={styles.heading}>{project.title}</h1>
              <IconButton 
                ariaLabel={t('profile')}
                onClick={() => {}}
              >
                <Icon icon='profile-circle' />
              </IconButton>
            </header>
            <div className={styles.content}>
              <div className={styles.elements}>
                <ElementTree 
                  projectId={project.id} 
                  content={project.data}
                  onSelectElement={selectElement}
                />
              </div>
              <div 
                className={styles.preview}
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: project.data }}
              />
            </div>
            <div className={styles.animations}>
              <AnimationArea
                projectId={project.id} 
                content={project.data}
                isPlaying={isPlaying}
                selectedElementId={selectedElementId}
                onPlay={play}
                onPause={pause}
              />
            </div>
          </>
        )}
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