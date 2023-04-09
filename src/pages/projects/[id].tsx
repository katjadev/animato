import { FC, useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { getDatabase, ref, set, onValue, remove } from 'firebase/database'
import { Project } from '@animato/types'
import { useAuth } from '@animato/context/authUserContext'
import { subscribeToProject } from '@animato/pages/api/projects'
import Logo from '@animato/components/logo/Logo'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from '@animato/styles/Project.module.css'

const inter = Inter({ subsets: ['latin'] })

interface ProjectProps {
  projectId: string;
}

const Project: FC<ProjectProps> = ({ projectId }) => {
  const t = useTranslations('project')
  const router = useRouter()
  const authUserContext = useAuth()
  
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    if (!authUserContext.currentUser && projectId !== 'demo-project') {
      router.push('/')
      return
    }

    subscribeToProject(projectId, authUserContext.currentUser, setProject)
  }, [authUserContext, projectId])

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
                <h2 className={styles.elementsTitle}>{t('elements')}</h2>
              </div>
              <div 
                className={styles.preview}
                dangerouslySetInnerHTML={{ __html: project.data }}
              />
            </div>
            <div className={styles.timeline}>
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