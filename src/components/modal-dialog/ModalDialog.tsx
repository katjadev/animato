import { FC, ReactNode, useEffect, useRef } from 'react'
import { Inter } from 'next/font/google'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from './ModalDialog.module.css'
import { useTranslations } from 'next-intl'

const inter = Inter({ subsets: ['latin'] })

interface ModalDialogProps {
  children?: ReactNode;
  isOpen: boolean;
  'aria-label': string;
  onClose: () => void;
}

const ModalDialog: FC<ModalDialogProps> = ({ 
  children,
  isOpen,
  'aria-label': ariaLabel,
  onClose,
}) => {
  const t = useTranslations()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (isOpen) {
      console.log(dialog)
      dialog?.showModal()
    } else {
      dialog?.close()
    }
    return () => dialog?.close()
  }, [isOpen]);

  return (
    <dialog 
      className={styles.dialog} 
      ref={ref} 
      aria-label={ariaLabel}
    >
      <IconButton 
        className={styles.closeButton} 
        ariaLabel={t('close')} 
        onClick={onClose} 
      >
        <Icon icon='cancel' />
      </IconButton>
      <div className={`${inter.className} ${styles.content}`}>
        {children}
      </div>
    </dialog>
  )
}

export default ModalDialog