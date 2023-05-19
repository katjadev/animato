'use client'

import { FC } from 'react'
import styles from './EditorSkeleton.module.css'
import Logo from '../logo/Logo';

type EditorSkeletonTranslations = {
  elements: string;
}

interface EditorSkeletonProps {
  translations: EditorSkeletonTranslations;
}

const EditorSkeleton: FC<EditorSkeletonProps> = ({ translations }) => {
  return (
    <>
      <div className={styles.header}>
        <Logo variant='compact' />
        <div className={`${styles.skeleton} ${styles.large}`} />
        <div className={styles.skeletonIcon} />
      </div>
      <div className={styles.elements}>
        <h2>{translations.elements}</h2>
      </div>
      <div 
        className={styles.player}
      />
      <div className={styles.controls}>
        <div className={styles.skeletonIcon} />
        <div className={styles.skeletonIcon} />
        <div className={styles.timer}>
          <div className={`${styles.skeleton} ${styles.small}`} />
        </div>
        <div className={styles.skeletonIcon} />
      </div>
      <div
        className={styles.timeline}
      />
      <div
        className={styles.animations}
      />
    </>
  )
}

export default EditorSkeleton