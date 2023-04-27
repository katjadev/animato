import { FC } from 'react'
import { useTranslations } from 'next-intl'
import Logo from '@animato/components/logo/Logo'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from './Header.module.css'

interface HeaderProps {
  title: string;
  className?: string;
}

const Header: FC<HeaderProps> = ({ title, className }) => {
  const t = useTranslations('project-header')
  
  return (
    <header className={`${styles.header} ${className}`}>
      <div className={styles.left}>
        <Logo variant='compact' />
        <IconButton ariaLabel={t('undo')}><Icon icon='undo' /></IconButton>
        <IconButton ariaLabel={t('redo')}><Icon icon='redo' /></IconButton>
      </div>
      <h1 className={styles.heading}>{title}</h1>
      <IconButton 
        ariaLabel={t('profile')}
        onClick={() => {}}
      >
        <Icon icon='profile-circle' />
      </IconButton>
    </header>
  )
}

export default Header