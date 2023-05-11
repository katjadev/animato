import { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import moment from 'moment'
import { useAuth } from '@animato/context/AuthContext'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/ProjectList.module.css'
import useProjects from '@animato/hooks/useProjects'

const inter = Inter({ subsets: ['latin'] })

export default function Projects() {
  const router = useRouter()
  const t = useTranslations('project-list')
  const { currentUser } = useAuth()
  const { state, actions } = useProjects()
  const { projects, loading, error } = state

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
  }, [currentUser])

  const handleCreateProject = async () => {
    try {
      const response = await fetch('/api/projects', { method: 'POST' })
      if (!response.ok) {
        throw Error();
      }

      const data = await response.json()
      router.push(`/projects/${data.id}`)
    } catch(error) {
      console.log(error)
      // TODO: display error dialog
    }
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
    } catch (error) {
      console.log(error)
      // TODO: display error dialog
    }
  }

  return(
    <>
      <Head title='Projects' />
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
        <div className={styles.list}>
          {loading && (
            <>{t('loading')}</>
          )}
          {!loading && error && (
            <>{t('error-message')}</>
          )}
          {!loading && !error && projects.length == 0 && (
            <>{t('empty-message')}</>
          )}
          {projects.length > 0 && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope='col'>{t('title')}</th>
                  <th scope='col'>{t('last-modified')}</th>
                  <th scope='col' className={styles.right}>
                    <span className='sr-only'>{t('actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>
                      <div className={styles.date}>
                        <div>{moment(project.modifiedAt).format('Do MMMM YYYY')}</div>
                        <div>{moment(project.modifiedAt).format('HH:mm:ss')}</div>
                      </div>
                    </td>
                    <td className={styles.right}>
                      <div className={styles.actions}>
                        <Button
                          variant='secondary'
                          size='small'
                          href={`/projects/${project.id}`}
                        >
                          {t('open')}
                        </Button>
                        <IconButton 
                          ariaLabel={t('delete-project')}
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Icon icon='trash' />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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