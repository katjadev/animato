import { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import useProjects from '@animato/hooks/useProjects'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import Button from '@animato/components/button/Button'
import ProjectList from '@animato/components/project-list/ProjectList'
import styles from '@animato/styles/ProjectList.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Projects() {
  const router = useRouter()
  const t = useTranslations('project-list')
  const { actions } = useProjects()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw Error();
        }

        const data = await response.json()
        actions.loadProjectsSuccess(data)
      } catch (_) {
        actions.loadProjectsFailure()
      }
    }

    loadProjects()
  }, [])

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', { method: 'POST' })
      if (!response.ok) {
        throw Error();
      }

      const data = await response.json()
      router.push(`/projects/${data.id}`)
    } catch(_) {}
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch('/api/projects', { 
        method: 'DELETE',
        body: JSON.stringify({ id }),
      })
      if (!response.ok) {
        throw Error();
      }
      
      actions.deleteProject(id)
    } catch (_) {}
  }

  return(
    <>
      <Head title={`Animato | ${t('projects')}`} />
      <main className={`${styles.main} ${inter.className}`}>
        <header className={styles.header}>
          <Logo variant='standard' />
          <IconButton 
            ariaLabel={t('profile')}
            onClick={() => {}}
          >
            <Icon icon='profile-circle' />
          </IconButton>
        </header>
        <h1 className={styles.heading}>{t('projects')}</h1>
        <div className={styles.toolbar}>
          <Button
            variant='primary'
            size='medium'
            onClick={handleCreateProject}
          >
            {t('new-project')}
          </Button>
        </div>
        <ProjectList onDelete={handleDeleteProject} />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ messages: [] }> = async (
  context
) => {
  return {
    props: {
      messages: (await import(`../../messages/${context.locale}.json`)).default
    },
  }
}