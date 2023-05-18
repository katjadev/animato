import Logo from '@animato/components/logo/Logo'
import CreateProjectButton from '@animato/components/create-project-button/CreateProjectButton'
import { useTranslations } from 'next-intl'
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
      <div className={styles.loading}>
        {t('project-list.loading')}
      </div>
    </main>
  )
}