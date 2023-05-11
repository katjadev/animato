import { FC } from 'react'
import moment from 'moment'
import { useTranslations } from 'next-intl'
import { Project } from '@animato/types'
import Button from '@animato/components/button/Button';
import IconButton from '@animato/components/icon-button/IconButton';
import Icon from '@animato/components/icon/Icon';
import styles from './ProjectRow.module.css'

interface ProjectRowProps {
  project: Project;
  onDelete: (id: string) => void;
}

const ProjectRow: FC<ProjectRowProps> = ({ project, onDelete }) => {
  const t = useTranslations('project-list')
  
  const handleDelete = () => {
    onDelete(project.id)
  }

  return (
    <tr>
      <td>{project.title}</td>
      <td>
        <div className={styles.date}>
          <div>{moment(project.modifiedAt).format('Do MMMM YYYY')}</div>
          <div>{moment(project.modifiedAt).format('HH:mm:ss')}</div>
        </div>
      </td>
      <td className={styles.right}>
        <div className={styles.actions}>
          <Button
            variant='secondary'
            size='small'
            href={`/projects/${project.id}`}
          >
            {t('open')}
          </Button>
          <IconButton 
            ariaLabel={t('delete-project')}
            onClick={handleDelete}
          >
            <Icon icon='trash' />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}

export default ProjectRow