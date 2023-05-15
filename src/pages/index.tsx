import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { Inter } from 'next/font/google'
import { useTranslations } from 'next-intl'
import { parseCookies } from 'nookies'
import { useAuth } from '@animato/context/AuthContext'
import { useDialog } from '@animato/context/DialogContext'
import Head from '@animato/components/head/Head'
import Logo from '@animato/components/logo/Logo'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/Home.module.css'
import verifyCookie from '@animato/utils/verifyCookie'

const inter = Inter({ subsets: ['latin'] })

interface HomeProps {
  authenticated: boolean; 
  email?: string;
}

export default function Home({ authenticated }: HomeProps) {
  const t = useTranslations()
  const { logOut } = useAuth()
  const { showLoginDialog, showSignupDialog } = useDialog()

  return (
    <>
      <Head />
      <main className={`${styles.main} ${inter.className}`}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <Logo variant='inverted' authenticated={authenticated} />
          </div>
          {authenticated && (
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
          {!authenticated && (
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
              {!authenticated && (
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

export const getServerSideProps: GetServerSideProps<{ messages: [] }> = async (
  context
) => {
  const cookies = parseCookies(context)
  const authentication = await verifyCookie(cookies.user)

  return {
    props: {
      messages: (await import(`../messages/${context.locale}.json`)).default,
      ...authentication,
    },
  }
}
