import { FC } from 'react'
import Icon from '@animato/components/icon/Icon'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import styles from './AutosaveStatus.module.css'

export type AutosaveStatusTranslations = {
  autosaveSaving: string;
  autosaveError: string;
  autosaveSaved: string;
}

interface AutosaveStatusProps {
  translations: AutosaveStatusTranslations;
}

const AutosaveStatus: FC<AutosaveStatusProps> = ({ translations }) => {
  const { 
    state: { saving, savingError },
  } = useProjectState()

  return (
    <div className={styles.autosave}>
      {saving && (
        <>
          <Icon icon='cloud-sync' />
          {translations.autosaveSaving}
        </>
      )}
      {savingError && (
        <>
          <Icon icon='cloud-error' />
          {translations.autosaveError}
        </>
      )}
      {!saving && !savingError && (
        <>
          <Icon icon='cloud-check' />
          {translations.autosaveSaved}
        </>
      )}
    </div>
  )
}

export default AutosaveStatus