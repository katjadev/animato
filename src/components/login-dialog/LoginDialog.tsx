import { ChangeEvent, FC, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@animato/context/AuthContext'
import ModalDialog from '@animato/components/modal-dialog/ModalDialog'
import Button from '@animato/components/button/Button'
import Input from '@animato/components/input/Input'
import styles from './LoginDialog.module.css'

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDialog: FC<LoginDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter()
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<{[key: string]: string}>({})
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const { logIn } = useAuth()

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    try {
      await logIn(email, password)
      router.push('/projects')
      onClose()
      setEmail('')
      setPassword('')
    } catch (error) {
      let message = ''
      if (error instanceof Error) message = error.message

      if (message.includes('auth/invalid-email')) {
        setError({ email: t('invalid-email') })
        emailRef.current?.focus()
      } else if (message.includes('auth/missing-password')) {
        setError({ password: t('missing-password') })
        passwordRef.current?.focus()
      } else if (message.includes('auth/user-not-found')) {
        setError({ email: t('user-not-found') })
        emailRef.current?.focus()
      } else if (message.includes('auth/wrong-password')) {
        setError({ password: t('wrong-password') })
        passwordRef.current?.focus()
      }
    }
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      aria-label={t('login-dialog.heading')}
      closeButtonAriaLabel={t('close')}
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
        <h2 className={styles.dialogHeader}>{t('login-dialog.heading')}</h2>
        <form>
          <div className={styles.field}>
            <Input
              type='text'
              id='login-dialog-email'
              name='email'
              label={t('email')}
              value={email}
              error={error.email}
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
              error={error.password}
              onChange={(event: ChangeEvent<HTMLInputElement>) => { setPassword(event.target.value) }}
            />
          </div>
          <Button 
            variant='primary'
            size='medium'
            onClick={handleSubmit}
          >
            {t('login-dialog.log-in')}
          </Button>
        </form>
      </div>
    </ModalDialog>
  )
}

export default LoginDialog