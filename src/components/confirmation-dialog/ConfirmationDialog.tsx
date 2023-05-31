import { FC, ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import ModalDialog from '@animato/components/modal-dialog/ModalDialog'
import Button from '@animato/components/button/Button'
import styles from './ConfirmationDialog.module.css'

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  content: string | ReactNode;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  content,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations()

  return (
    <ModalDialog
      isOpen={isOpen}
      aria-label={title}
      closeButtonAriaLabel={t('close')}
      onClose={onCancel}
    >
      <div className={styles.content}>
        <h2 className={styles.heading}>{title}</h2>
        {content}
        <div className={styles.footer}>
          <Button 
            variant='secondary' 
            size='medium'
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
          <Button 
            variant='primary' 
            size='medium'
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </ModalDialog>
  )
}

export default ConfirmationDialog