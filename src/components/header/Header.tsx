import { FC, useCallback } from 'react'
import debounce from '@animato/utils/debounce'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import ProjectMenu, { ProjectMenuTranslations } from '@animato/components/project-menu/ProjectMenu'
import EditableText from '@animato/components/editable-text/EditableText'
import AutosaveStatus, { AutosaveStatusTranslations } from '@animato/components/autosave-status/AutosaveStatus'
import { useDialog } from '@animato/context/DialogContext'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import styles from './Header.module.css'

export type HeaderTranslations = ProjectMenuTranslations & AutosaveStatusTranslations & {
  profile: string;
  undo: string;
  redo: string;
  editTitleAriaLabel: string;
  savingErrorTitle: string;
  savingErrorMessage: string;
}

interface HeaderProps {
  className?: string;
  isAuthenticated: boolean;
  translations: HeaderTranslations;
}

const Header: FC<HeaderProps> = ({ 
  className,
  isAuthenticated,
  translations,
}) => {
  const { showErrorDialog } = useDialog()
  const { 
    state: { id, title, undoableHistory, redoableHistory }, 
    actions,
  } = useProjectState()

  const saveProject = useCallback(debounce(async (data: { title?: string, data?: string }) => {
    actions.savingStart()
    const response = await fetch(`/api/projects/${id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      showErrorDialog(
        translations.savingErrorTitle, 
        translations.savingErrorMessage,
      )
      actions.savingError()
      return
    }

    actions.savingSuccess()
  }, 500), [id])

  const handleRename = (value: string) => {
    actions.renameProject({ title: value })
    saveProject({ title: value })
  }

  const handleUndo = () => {
    actions.undo()
    const historyItem = undoableHistory[undoableHistory.length - 1]
    saveProject({
      title: historyItem.title,
      data: historyItem.data,
    })
  }

  const handleRedo = () => {
    actions.redo()
    const historyItem = redoableHistory[redoableHistory.length - 1]
    saveProject({
      title: historyItem.title,
      data: historyItem.data,
    })
  }

  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.left}>
        <ProjectMenu 
          isAuthenticated={isAuthenticated}
          translations={translations}
        />
        <IconButton 
          aria-label={translations.undo}
          disabled={undoableHistory.length === 0}
          onClick={handleUndo}
        >
          <Icon icon='undo' />
        </IconButton>
        <IconButton 
          aria-label={translations.redo}
          disabled={redoableHistory.length === 0}
          onClick={handleRedo}
        >
          <Icon icon='redo' />
        </IconButton>
      </div>
      <h1 className={styles.heading}>
        <EditableText 
          value={title}
          aria-label={translations.editTitleAriaLabel}
          onChange={handleRename}
        />
      </h1>
      <div className={styles.right}>
        <AutosaveStatus translations={translations} />
        <IconButton aria-label={translations.profile}>
          <Icon icon='profile-circle' />
        </IconButton>
      </div>
    </header>
  )
}

export default Header