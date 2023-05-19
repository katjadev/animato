import Logo from '@animato/components/logo/Logo'
import { useTranslations } from 'next-intl'
import styles from './page.module.css'

export default function Loading() {
  const t = useTranslations()
  
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Logo variant='inverted' />
        </div>
      </header>
      <div className={styles.description}>
        <div className={styles.descriptionContent}>
          <h1>{t('home.title')}</h1>
          <p>{t('home.description')}</p>
          <div className={styles.buttons}></div>
        </div>
      </div>
    </main>
  )
}