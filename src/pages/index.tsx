import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import Button from '@animato/components/button/Button'
import styles from '@animato/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <Button 
            variant="secondary-inverted" 
            size="medium"
            onClick={() => {}}
          >
            Log in
          </Button>
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
              that capture your audience's attention.
            </p>
            <div className={styles.buttons}>
              <Button 
                variant="primary"
                size="large"
                onClick={() => {}}
              >
                Get Started
              </Button>
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
    </>
  )
}
