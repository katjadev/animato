import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { getAuth, signOut } from 'firebase/auth'
import { useAuth } from '@animato/context/authUserContext'
import Button from '@animato/components/button/Button'
import SignupDialog from '@animato/components/signup-dialog/SignupDialog'
import LoginDialog from '@animato/components/login-dialog/LoginDialog'
import styles from '@animato/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const authUserContext = useAuth()

  const logOut = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <>
      <Head>
        <title>Animato</title>
        <meta name="description" content="Bring your designs to life with animated SVGs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <header className={styles.header}>
          <Link 
            className={styles.logo} 
            href="/"
          >
            <Image
              src="/logo.svg"
              alt="Animato Logo"
              className={styles.logoImage}
              width={44}
              height={44}
              priority
            />
            <span>Animato</span>
          </Link>
          
          {authUserContext?.email && (
            <Button 
              variant="secondary-inverted" 
              size="medium"
              onClick={logOut}
            >
              Log out
            </Button>
          )}
          {!authUserContext?.email && (
            <Button 
              variant="secondary-inverted" 
              size="medium"
              onClick={() => setIsLoginDialogOpen(true)}
            >
              Log in
            </Button>
          )}
        </header>
        <div className={styles.description}>
          <div className={styles.descriptionContent}>
            <h1>
              Bring your designs to life with animated SVGs
            </h1>
            <p>
              Animato empowers you to easily create and animate
              scalable vector graphics, breathing life into your designs 
              and enhancing your web presence with eye-catching visuals
              that capture your audience&apos;s attention.
            </p>
            <div className={styles.buttons}>
              {!authUserContext?.email && (
                <Button 
                  variant="primary"
                  size="large"
                  onClick={() => setIsSignupDialogOpen(true)}
                >
                  Get Started
                </Button>
              )}
              <Button 
                variant="secondary-inverted"
                size="large"
                onClick={() => {}}
              >
                Explore a demo project
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
