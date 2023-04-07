import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Logo.module.css'

interface LogoProps {
  variant: 'standard' | 'inverted',
  className?: string,
}

const Logo: FC<LogoProps> = ({ variant, className }) => (
  <Link 
    className={`${styles.logo} ${styles[variant]} ${className}`} 
    href='/'
  >
    <Image
      src='/logo.svg'
      alt='Animato Logo'
      className={styles.logoImage}
      width={44}
      height={44}
      priority
    />
    <span>Animato</span>
  </Link>
)

export default Logo