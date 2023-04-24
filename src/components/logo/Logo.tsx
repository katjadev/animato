import { FC, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
// import { 
//   SvgFormat, 
//   NavArrowDown, 
//   Download, 
//   ArrowLeft,
// } from 'iconoir-react'
import Icon from '@animato/components/icon/Icon'
import Menu from '@animato/components/menu/Menu'
import MenuItem from '@animato/components/menu-item/MenuItem'
import MenuItemDivider from '@animato/components/menu-item-divider/MenuItemDivider'
import styles from './Logo.module.css'

interface LogoProps {
  variant: 'standard' | 'inverted' | 'compact',
  className?: string,
}

const Logo: FC<LogoProps> = ({ variant, className }) => {
  const t = useTranslations('main-menu')
  const size = variant === 'compact' ? 32 : 44
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (variant === 'compact') {
    return (
      <>
        <button
        className={`${styles.logo} ${styles[variant]} ${className || ''}`}
        aria-controls={open ? 'main-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Image
          src='/logo.svg'
          alt='Animato Logo'
          className={styles.logoImage}
          width={size}
          height={size}
          priority
        />
        <Icon icon='nav-arrow-down' />
      </button>
      <Menu
        id='main-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <Icon icon='svg-format' />
          {t('import-svg')}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Icon icon='download' />
          {t('export')}
        </MenuItem>
        <MenuItemDivider />
        <MenuItem href='/projects'>
          <Icon icon='arrow-left' />
          {t('back-to-projects')}
        </MenuItem>
      </Menu>
      </>
    )
  }

  return (
    <Link 
      className={`${styles.logo} ${styles[variant]} ${className || ''}`} 
      href='/'
    >
      <Image
        src='/logo.svg'
        alt='Animato Logo'
        className={styles.logoImage}
        width={size}
        height={size}
        priority
      />
      <span>Animato</span>
    </Link>
  )
}

export default Logo