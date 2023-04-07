import { ChangeEvent, FC, MouseEventHandler, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import ModalDialog from '@animato/components/modal-dialog/ModalDialog'
import Button from '@animato/components/button/Button'
import Input from '@animato/components/input/Input'
import styles from './LoginDialog.module.css'

interface LoginDialogProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLButtonElement>;
}

const LoginDialog: FC<LoginDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter()
  const t = useTranslations('login-dialog')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const auth = getAuth()
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        router.push('/projects')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log({ errorCode, errorMessage }) // TODO: handle error
      })
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      ariaLabel={t('log-in')}
      onClose={onClose}
    >
      <div className={styles.left}>
        <div className={styles.quote}>
          <div className={styles.quoteText}>
            Art enables us to find ourselves and lose ourselves at the same time.
          </div>
          <div className={styles.author}>
            Thomas Merton
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <h2 className={styles.dialogHeader}>{t('log-in')}</h2>
        <form>
          <div className={styles.field}>
            <Input
              type='text'
              id='login-dialog-email'
              name='email'
              label={t('email')}
              value={email}
              onChange={(event: ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value) }}
            />
          </div>
          <div className={styles.field}>
            <Input
              type='password'
              id='login-dialog-password'
              name='password'
              label={t('password')}
              value={password}
              onChange={(event: ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value) }}
            />
          </div>
          <Button 
            variant='primary'
            size='medium'
            onClick={handleSubmit}
          >
            {t('log-in')}
          </Button>
        </form>
      </div>
    </ModalDialog>
  )
}

export default LoginDialog