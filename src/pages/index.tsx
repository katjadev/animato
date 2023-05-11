import { useState } from 'react'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { useAuth } from '@animato/context/authUserContext'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Button from '@animato/components/button/Button'
import SignupDialog from '@animato/components/signup-dialog/SignupDialog'
import LoginDialog from '@animato/components/login-dialog/LoginDialog'
import styles from '@animato/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const t = useTranslations()
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const { currentUser, logOut } = useAuth()

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
              onClick={() => setIsLoginDialogOpen(true)}
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
                  onClick={() => setIsSignupDialogOpen(true)}
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
      <SignupDialog
        isOpen={isSignupDialogOpen} 
        onClose={() => setIsSignupDialogOpen(false)} 
      />
      <LoginDialog
        isOpen={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)} 
      />
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
