import { FC, ReactNode, useEffect, useRef } from 'react'
import Icon from '@animato/components/icon/Icon'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from './ModalDialog.module.css'

interface ModalDialogProps {
  children?: ReactNode;
  isOpen: boolean;
  'aria-label': string;
  closeButtonAriaLabel: string;
  onClose: () => void;
}

const ModalDialog: FC<ModalDialogProps> = ({ 
  children,
  isOpen,
  'aria-label': ariaLabel,
  closeButtonAriaLabel,
  onClose,
}) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (isOpen) {
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
        aria-label={closeButtonAriaLabel} 
        onClick={onClose} 
      >
        <Icon icon='cancel' />
      </IconButton>
      <div className={styles.content}>
        {children}
      </div>
    </dialog>
  )
}

export default ModalDialog