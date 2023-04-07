import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useAuth } from '@animato/context/authUserContext'
import Logo from '@animato/components/logo/Logo'
import IconButton from '@animato/components/icon-button/IconButton'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/ProjectList.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Projects() {
  const authUserContext = useAuth()

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
            ariaLabel='Profile'
            onClick={() => {}}
          />
        </header>
        <h1 className={styles.heading}>Projects</h1>
        <div className={styles.toolbar}>
          <Button
            variant='primary'
            size='medium'
            onClick={() => {}}
          >
            New project
          </Button>
        </div>
        <div className={styles.list}>
          You don&apos;t have any projects yet.
        </div>
      </main>
    </>
  );
}