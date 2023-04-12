import { FC, useEffect, useRef, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { Project } from '@animato/types'
import { ALLOWED_SVG_ELEMENTS } from '@animato/constants';
import { useAuth } from '@animato/context/authUserContext'
import { subscribeToProject } from '@animato/pages/api/projects'
import Logo from '@animato/components/logo/Logo'
import IconButton from '@animato/components/icon-button/IconButton'
import ElementTree from '@animato/components/element-tree/ElementTree'
import AnimationArea from '@animato/components/animation-area/AnimationArea'
import styles from '@animato/styles/Project.module.css'

const inter = Inter({ subsets: ['latin'] })

interface ProjectProps {
  projectId: string;
}

const Project: FC<ProjectProps> = ({ projectId }) => {
  const t = useTranslations('project')
  const router = useRouter()
  const authUserContext = useAuth()
  const previewRef = useRef<HTMLDivElement>(null)
  
  const [project, setProject] = useState<Project | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!authUserContext.currentUser && projectId !== 'demo-project') {
      router.push('/')
      return
    }

    subscribeToProject(projectId, authUserContext.currentUser, setProject)
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

  return(
    <>
      <Head>
        <title>Animato</title>
        <meta name='description' content='Bring your designs to life with animated SVGs' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        {project !== null && (
          <>
            <header className={styles.header}>
              <div className={styles.left}>
                <Logo variant='compact' />
                <IconButton icon='icon-undo' ariaLabel={t('undo')} />
                <IconButton icon='icon-redo' ariaLabel={t('redo')} />
              </div>
              <h1 className={styles.heading}>{project.title}</h1>
              <IconButton 
                icon='icon-person' 
                ariaLabel={t('profile')}
                onClick={() => {}}
              />
            </header>
            <div className={styles.content}>
              <div className={styles.elements}>
                <ElementTree 
                  projectId={project.id} 
                  content={project.data}
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
) => {
  return {
    props: {
      messages: (await import(`../../messages/${context.locale}.json`)).default,
      projectId: context.params?.id,
    },
  }
}

export default Project