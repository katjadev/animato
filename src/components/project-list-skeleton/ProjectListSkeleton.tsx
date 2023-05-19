import { FC } from 'react'
import styles from './ProjectListSkeleton.module.css'

export type ProjectListSkeletonTranslations = {
  projects: string;
  newProject: string;
  emptyMessage: string;
  errorMessage: string;
  title: string;
  lastModified: string;
  actions: string;
}

interface ProjectListSkeletonProps {
  translations: ProjectListSkeletonTranslations;
}

const ProjectListSkeleton: FC<ProjectListSkeletonProps> = ({ translations }) => {
  return (
    <div className={styles.list}>
      <table className={styles.table} aria-label={translations.projects}>
        <thead>
          <tr>
            <th scope='col'>{translations.title}</th>
            <th scope='col'>{translations.lastModified}</th>
            <th scope='col' className={styles.right}>
              <span className='sr-only'>{translations.actions}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={`${styles.skeleton} ${styles.large}`} />
            </td>
            <td>
              <div className={`${styles.skeleton} ${styles.medium}`} />
              <div className={`${styles.skeleton} ${styles.small}`} />
            </td>
            <td className={styles.right}>
              <div className={`${styles.skeleton} ${styles.small}`} />
            </td>
          </tr>
          <tr>
            <td>
              <div className={`${styles.skeleton} ${styles.large}`} />
            </td>
            <td>
              <div className={`${styles.skeleton} ${styles.medium}`} />
              <div className={`${styles.skeleton} ${styles.small}`} />
            </td>
            <td className={styles.right}>
              <div className={`${styles.skeleton} ${styles.small}`} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ProjectListSkeleton