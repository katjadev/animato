import { FC } from 'react'
import { useTranslations } from 'next-intl'
import useProjects from '@animato/hooks/useProjects'
import ProjectRow from '@animato/components/project-row/ProjectRow'
import styles from './ProjectList.module.css'

interface ProjectListProps {
  onDelete: (id: string) => void;
}

const ProjectList: FC<ProjectListProps> = ({ onDelete }) => {
  const t = useTranslations('project-list')
  const { state } = useProjects()
  const { projects, loading, error } = state

  return (
    <div className={styles.list}>
      {loading && (
        <>{t('loading')}</>
      )}
      {!loading && error && (
        <>{t('error-message')}</>
      )}
      {!loading && !error && projects.length == 0 && (
        <>{t('empty-message')}</>
      )}
      {projects.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope='col'>{t('title')}</th>
              <th scope='col'>{t('last-modified')}</th>
              <th scope='col' className={styles.right}>
                <span className='sr-only'>{t('actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <ProjectRow
                key={project.id} 
                project={project} 
                onDelete={onDelete} 
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProjectList