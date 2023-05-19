import { useTranslations } from 'next-intl'
import Logo from '@animato/components/logo/Logo'
import CreateProjectButton from '@animato/components/create-project-button/CreateProjectButton'
import ProjectListSkeleton from '@animato/components/project-list-skeleton/ProjectListSkeleton'
import styles from './page.module.css'

export default function Loading() {
  const t = useTranslations()

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <Logo variant='standard' />
      </header>
      <h1 className={styles.heading}>{t('project-list.projects')}</h1>
      <div className={styles.toolbar}>
        <CreateProjectButton disabled={true}>
          {t('project-list.new-project')}
        </CreateProjectButton>
      </div>
      <ProjectListSkeleton
        translations={{
          projects: t('project-list.projects'),
          newProject: t('project-list.new-project'),
          emptyMessage: t('project-list.empty-message'),
          errorMessage: t('project-list.error-message'),
          title: t('project-list.title'),
          lastModified: t('project-list.last-modified'),
          actions: t('project-list.actions'),
        }}
      />
    </main>
  )
}