import { FC, useState } from 'react'
import Image from 'next/image'
import replaceIds from '@animato/utils/replaceIds'
import { useProjectState } from '@animato/context/ProjectContext/ProjectContextProvider'
import Menu from '../menu/Menu'
import MenuItem from '../menu-item/MenuItem'
import Icon from '../icon/Icon'
import MenuItemDivider from '../menu-item-divider/MenuItemDivider'
import styles from './ProjectMenu.module.css'

export type ProjectMenuTranslations = {
  importSvg: string;
  export: string;
  backToProjects: string;
}

interface ProjectMenuProps {
  translations: ProjectMenuTranslations;
  isAuthenticated: boolean;
}

const ProjectMenu: FC<ProjectMenuProps> = ({ translations, isAuthenticated }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const { actions } = useProjectState()

  const importSvg = async () => {
    // TODO: add confirmation if data is not empty

    const handleFileContent = (content: string) => {
      actions.importSvg({ data: replaceIds(content) })
    }

    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "SVG images",
            accept: {
              "image/svg": [".svg"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      })
      const file = await fileHandle.getFile()

      const fileReader = new FileReader()
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string') {
          handleFileContent(fileReader.result)
        }
      }

      fileReader.readAsText(file)
    } catch (_) {}
  }

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
  
  return (
    <>
      <button
        className={styles.button}
        aria-controls={open ? 'main-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <Image
          src='/logo.svg'
          alt='Animato Logo'
          className={styles.image}
          width={32}
          height={32}
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
        <MenuItem onClick={importSvg}>
          <Icon icon='svg-format' />
          {translations.importSvg}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Icon icon='download' />
          {translations.export}
        </MenuItem>
        {isAuthenticated && (
          <>
            <MenuItemDivider />
            <MenuItem href='/projects'>
              <Icon icon='arrow-left' />
              {translations.backToProjects}
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  )
}

export default ProjectMenu