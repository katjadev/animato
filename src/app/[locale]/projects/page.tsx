import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import verifyCookie from '@animato/utils/verifyCookie'
import { getTranslations } from 'next-intl/server'
import Logo from '@animato/components/logo/Logo'
import CreateProjectButton from '@animato/components/create-project-button/CreateProjectButton'
import ProjectList from '@animato/components/project-list/ProjectList'
import styles from './page.module.css'

export default async function Projects() {
  const t = await getTranslations()
  const { authenticated, userId } = await getAuthentication()
  if (!authenticated || !userId) {
    redirect('/')
  }
  const { projects, error } = await getProjects(userId)

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Logo variant='standard' />
      </header>
      <h1 className={styles.heading}>{t('project-list.projects')}</h1>
      <div className={styles.toolbar}>
        <CreateProjectButton>
          {t('project-list.new-project')}
        </CreateProjectButton>
      </div>
      {error && (
        <p>{t('project-list.error-message')}</p>
      )}
      {!error && projects && (
        <ProjectList
          projects={projects}
          translations={{
            projects: t('project-list.projects'),
            newProject: t('project-list.new-project'),
            emptyMessage: t('project-list.empty-message'),
            errorMessage: t('project-list.error-message'),
            title: t('project-list.title'),
            lastModified: t('project-list.last-modified'),
            actions: t('project-list.actions'),
            open: t('project-list.open'),
            deleteProject: t('project-list.delete-project'),
            deleteProjectErrorTitle: t('project-list.delete-project-error-title'),
            deleteProjectErrorMessage: t('project-list.delete-project-error-message'),
          }}
        />
      )}
    </main>
  )
}

const getAuthentication = async () => {
  const user = cookies().get('user')
  return verifyCookie(user?.value || '')
}

const getProjects = async (userId: string) => {
  const prisma = new PrismaClient()
  try {
    const projects = await prisma.project.findMany({
      where: { userId },
    })
    return { projects }
  } catch (error) {
    return { error: true }
  } finally {
    await prisma.$disconnect()
  }
}
