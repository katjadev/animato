'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Logo.module.css'

interface LogoProps {
  variant: 'standard' | 'inverted' | 'compact';
  className?: string;
}

const Logo: FC<LogoProps> = ({ variant, className }) => {
  const size = variant === 'compact' ? 32 : 44
  return (
    <Link 
      className={`${styles.logo} ${styles[variant]} ${className || ''}`} 
      href='/'
    >
      <Image
        src='/logo.svg'
        alt='Animato Logo'
        className={styles.logoImage}
        width={size}
        height={size}
        priority
      />
      {variant !== 'compact' && (
        <span>Animato</span>
      )}
    </Link>
  )
}

export default Logo