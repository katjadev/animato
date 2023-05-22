import { FC } from 'react'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import ProjectMenu, { ProjectMenuTranslations } from '../project-menu/ProjectMenu'
import styles from './Header.module.css'

export type HeaderTranslations = ProjectMenuTranslations & {
  profile: string;
  undo: string;
  redo: string;
}

interface HeaderProps {
  title: string;
  className?: string;
  isAuthenticated: boolean;
  translations: HeaderTranslations;
}

const Header: FC<HeaderProps> = ({ 
  title, 
  className,
  isAuthenticated,
  translations,
}) => {
  return (
    <header className={`${styles.header} ${className || ''}`}>
      <div className={styles.left}>
        <ProjectMenu 
          isAuthenticated={isAuthenticated}
          translations={translations}
        />
        <IconButton ariaLabel={translations.undo}><Icon icon='undo' /></IconButton>
        <IconButton ariaLabel={translations.redo}><Icon icon='redo' /></IconButton>
      </div>
      <h1 className={styles.heading}>{title}</h1>
      <IconButton ariaLabel={translations.profile}>
        <Icon icon='profile-circle' />
      </IconButton>
    </header>
  )
}

export default Header