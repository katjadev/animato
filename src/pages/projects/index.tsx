import { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { useAuth } from '@animato/context/authUserContext'
import Logo from '@animato/components/logo/Logo'
import IconButton from '@animato/components/icon-button/IconButton'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/ProjectList.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Projects() {
  const t = useTranslations('project-list')
  const router = useRouter()
  const authUserContext = useAuth()

  useEffect(() => {
    if (!authUserContext.currentUser) {
      router.push('/')
    }
  }, [authUserContext])

  return(
    <>
      <Head>
        <title>Animato</title>
        <meta name='description' content='Bring your designs to life with animated SVGs' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <header className={styles.header}>
          <Logo variant='standard' />
          <IconButton 
            icon='icon-user' 
            ariaLabel={t('profile')}
            onClick={() => {}}
          />
        </header>
        <h1 className={styles.heading}>{t('projects')}</h1>
        <div className={styles.toolbar}>
          <Button
            variant='primary'
            size='medium'
            onClick={() => {}}
          >
            {t('new-project')}
          </Button>
        </div>
        <div className={styles.list}>
          {t('empty-message')}
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