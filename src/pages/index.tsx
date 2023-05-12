import { useState } from 'react'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { useAuth } from '@animato/context/AuthContext'
import { useDialog } from '@animato/context/DialogContext'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const t = useTranslations()
  const { currentUser, logOut } = useAuth()
  const { showLoginDialog, showSignupDialog } = useDialog()

  return (
    <>
      <Head />
      <main className={`${styles.main} ${inter.className}`}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Logo variant='inverted' />
          </div>
          
          {currentUser && (
            <>
              <Link href='/projects'>{t('projects')}</Link>
              <Button 
                variant='secondary-inverted' 
                size='medium'
                onClick={logOut}
              >
                {t('logout')}
              </Button>
            </>
          )}
          {!currentUser && (
            <Button 
              variant='secondary-inverted'
              size='medium'
              onClick={showLoginDialog}
            >
              {t('login')}
            </Button>
          )}
        </header>
        <div className={styles.description}>
          <div className={styles.descriptionContent}>
            <h1>
            {t('home-title')}
            </h1>
            <p>{t('home-description')}</p>
            <div className={styles.buttons}>
              {!currentUser && (
                <Button 
                  variant='primary'
                  size='large'
                  onClick={showSignupDialog}
                >
                  {t('get-started')}
                </Button>
              )}
              <Button 
                variant='secondary-inverted'
                size='large'
                href='/projects/demo-project'
              >
                {t('explore-demo-project')}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps<{ messages: [] }> = async (
  context
) => {
  return {
    props: {
      messages: (await import(`../messages/${context.locale}.json`)).default
    },
  }
}
