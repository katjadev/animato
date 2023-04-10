import { FC, MouseEventHandler, ReactNode } from 'react'
import Link from 'next/link'
import styles from './MenuItem.module.css'
import Icon from '../icon/Icon';

interface MenuItemProps {
  children?: ReactNode;
  href?: string;
  icon?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const MenuItem: FC<MenuItemProps> = ({
  children,
  href,
  icon,
  onClick,
}) => {
  const content = (
    <>
      {icon && (
        <Icon 
          className={styles.icon} 
          icon={icon}
        />
      )}
      {children}
    </>
  )

  return (
    <li className={styles.menuItem}>
      {href && (
        <Link
          className={styles.button} 
          href={href}
        > 
          {content}
        </Link>
      )}
      {!href && (
        <button 
          className={styles.button}
          onClick={onClick}
        >
          {content}
        </button>
      )}
    </li>
  )
}

export default MenuItem