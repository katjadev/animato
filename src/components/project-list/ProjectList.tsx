import { FC } from 'react'
import { Project } from '@animato/types'
import ProjectRow, { ProjectRowTranslations } from '@animato/components/project-row/ProjectRow'
import styles from './ProjectList.module.css'

export type ProjectListTranslations = ProjectRowTranslations & {
  projects: string;
  newProject: string;
  emptyMessage: string;
  errorMessage: string;
  title: string;
  lastModified: string;
  actions: string;
}

interface ProjectListProps {
  projects: Project[];
  translations: ProjectListTranslations;
}

const ProjectList: FC<ProjectListProps> = ({ projects, translations }) => {
  return (
    <div className={styles.list}>
      {projects.length == 0 && (
        <>{translations.emptyMessage}</>
      )}
      {projects.length > 0 && (
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
            {projects.map((project) => (
              <ProjectRow
                key={project.id} 
                project={project}
                translations={translations}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ProjectList