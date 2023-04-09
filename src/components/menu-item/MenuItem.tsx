import { FC, MouseEventHandler, ReactNode } from 'react'
import Link from 'next/link'
import styles from './MenuItem.module.css'

interface MenuItemProps {
  children?: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const MenuItem: FC<MenuItemProps> = ({
  children,
  href,
  onClick,
}) => (
  <li className={styles.menuItem}>
    {href && (
      <Link
        className={styles.button} 
        href={href}
      >
        {children}
      </Link>
    )}
    {!href && (
      <button 
        className={styles.button}
        onClick={onClick}
      >
        {children}
      </button>
    )}
  </li>
)

export default MenuItem