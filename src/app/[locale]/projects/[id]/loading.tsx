import { useTranslations } from 'next-intl'
import EditorSkeleton from '@animato/components/editor-skeleton/EditorSkeleton'
import styles from './page.module.css'

export default function Loading() {
  const t = useTranslations()

  return (
    <main className={styles.main}>
      <EditorSkeleton
        translations={{
          elements: t('project.elements'),
        }}
      />
    </main>
  )
}