import Link from 'next/link'
import { cookies } from 'next/headers'
import verifyCookie from '@animato/utils/verifyCookie'
import { getTranslations } from 'next-intl/server'
import Logo from '@animato/components/logo/Logo'
import Button from '@animato/components/button/Button'
import LoginButton from '@animato/components/login-button/LoginButton'
import SignupButton from '@animato/components/signup-button/SignupButton'
import LogoutButton from '@animato/components/logout-button/LogoutButton'
import styles from './page.module.css'

export default async function Home() {
  const t = await getTranslations()
  const { authenticated } = await getAuthentication()

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Logo variant='inverted' />
        </div>
        {authenticated && (
          <>
            <Link href='/projects'>{t('projects')}</Link>
            <LogoutButton>
              {t('logout')}
            </LogoutButton>
          </>
        )}
        {!authenticated && (
          <LoginButton>
            {t('login')}
          </LoginButton>
        )}
      </header>
      <div className={styles.description}>
        <div className={styles.descriptionContent}>
          <h1>{t('home.title')}</h1>
          <p>{t('home.description')}</p>
          <div className={styles.buttons}>
            {!authenticated && (
              <SignupButton>
                {t('home.get-started')}
              </SignupButton>
            )}
            <Button 
              variant='secondary-inverted'
              size='large'
              href='/editor/demo-project'
            >
              {t('home.explore-demo-project')}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

const getAuthentication = async () => {
  const user = cookies().get('user')
  return verifyCookie(user?.value || '')
}
