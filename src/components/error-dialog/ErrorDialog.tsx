import { FC, ReactNode } from 'react'
import ModalDialog from '@animato/components/modal-dialog/ModalDialog'
import Button from '@animato/components/button/Button'
import styles from './ErrorDialog.module.css'
import { useTranslations } from 'next-intl';

interface ErrorDialogProps {
  isOpen: boolean;
  title: string;
  content: string | ReactNode;
  onClose: () => void;
}

const ErrorDialog: FC<ErrorDialogProps> = ({
  isOpen,
  title,
  content,
  onClose,
}) => {
  const t = useTranslations()

  return (
    <ModalDialog
      isOpen={isOpen}
      aria-label={title}
      closeButtonAriaLabel={t('close')}
      onClose={onClose}
    >
      <div className={styles.content}>
        <h2 className={styles.heading}>{title}</h2>
        {content}
        <div className={styles.footer}>
          <Button 
            variant='secondary' 
            size='medium'
            onClick={onClose}
          >
            {t('close')}
          </Button>
        </div>
      </div>
    </ModalDialog>
  )
}

export default ErrorDialog