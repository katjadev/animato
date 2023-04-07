import { FC, MouseEventHandler, ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Modal from 'react-modal'
import IconButton from '@animato/components/icon-button/IconButton'
import styles from './ModalDialog.module.css'

const customStyles = {
  overlay: {
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    zIndex: 1001,
    padding: 0,
    border: 'none',
  },
}

const inter = Inter({ subsets: ['latin'] })

interface ModalDialogProps {
  children?: ReactNode;
  isOpen: boolean;
  ariaLabel: string;
  onClose: MouseEventHandler<HTMLButtonElement>;
}

const ModalDialog: FC<ModalDialogProps> = ({ 
  children,
  isOpen,
  ariaLabel,
  onClose,
}) => {
  Modal.setAppElement('#__next')

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel={ariaLabel}
    >
      <IconButton 
        className={styles.closeButton} 
        icon='icon-cross' 
        ariaLabel='Close' 
        onClick={onClose} 
      />
      <div className={`${inter.className} ${styles.content}`}>
        {children}
      </div>
    </Modal>
  )
}

export default ModalDialog