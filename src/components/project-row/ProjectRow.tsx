'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { tz } from 'moment-timezone'
import { Project } from '@animato/types'
import { DialogProvider, useDialog } from '@animato/context/DialogContext'
import Button from '@animato/components/button/Button';
import IconButton from '@animato/components/icon-button/IconButton';
import Icon from '@animato/components/icon/Icon';
import styles from './ProjectRow.module.css'

export type ProjectRowTranslations = {
  open: string;
  deleteProject: string;
  deleteProjectErrorTitle: string;
  deleteProjectErrorMessage: string;
}

interface ProjectRowProps {
  project: Project;
  translations: ProjectRowTranslations;
}

const ProjectRowComponent: FC<ProjectRowProps> = ({ project, translations }) => {
  const router = useRouter()
  const { showErrorDialog } = useDialog()
  const updatedAt = moment(project.updatedAt).tz(tz.guess())

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, { 
        method: 'DELETE',
      })
      if (!response.ok) {
        throw Error()
      }
      router.refresh()
    } catch (_) {
      showErrorDialog(
        translations.deleteProjectErrorTitle, 
        translations.deleteProjectErrorMessage,
      )
    }
  }

  return (
    <tr>
      <td>{project.title}</td>
      <td>
        <div className={styles.date}>
          <div>{updatedAt.format('Do MMMM YYYY')}</div>
          <div>{updatedAt.format('HH:mm:ss')}</div>
        </div>
      </td>
      <td className={styles.right}>
        <div className={styles.actions}>
          <Button
            variant='secondary'
            size='small'
            href={`/editor/${project.id}`}
          >
            {translations.open}
          </Button>
          <IconButton 
            aria-label={translations.deleteProject}
            onClick={handleDelete}
          >
            <Icon icon='trash' />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}

export default function ProjectRow(props: ProjectRowProps) {
  return (
    <DialogProvider>
      <ProjectRowComponent {...props} />
    </DialogProvider>
  )
}