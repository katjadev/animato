import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import moment from 'moment'
import { useAuth } from '@animato/context/authUserContext'
import { Project } from '@animato/types'
import { 
  createProject, 
  deleteProject, 
  subscribeToProjects,
} from '@animato/pages/api/projects'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/ProjectList.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Projects() {
  const t = useTranslations('project-list')
  const router = useRouter()
  const authUserContext = useAuth()
  
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    if (!authUserContext.currentUser) {
      router.push('/')
      return
    }

    subscribeToProjects(authUserContext.currentUser, setProjects)
  }, [authUserContext, router])

  const handleCreateProject = async () => {
    const projectId = await createProject(authUserContext.currentUser)
    router.push(`/projects/${projectId}`)
  }

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId, authUserContext.currentUser)
    setProjects(projects.filter((project) => project.id !== projectId))
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
          {projects.length == 0 && (
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