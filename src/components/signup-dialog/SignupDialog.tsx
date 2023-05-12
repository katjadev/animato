import { ChangeEvent, FC, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { useAuth } from '@animato/context/AuthContext'
import ModalDialog from '@animato/components/modal-dialog/ModalDialog'
import Button from '@animato/components/button/Button'
import Input from '@animato/components/input/Input'
import styles from './SignupDialog.module.css'

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupDialog: FC<SignupDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter()
  const t = useTranslations('signup-dialog')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<{[key: string]: string}>({})
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const { signUp } = useAuth()

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    
    try {
      await signUp(email, password)
      router.push('/projects')
      onClose()
      setEmail('')
      setPassword('')
    } catch(error) {
      let message = ''
      if (error instanceof Error) message = error.message

      if (message.includes('auth/invalid-email')) {
        setError({ email: t('invalid-email') })
        emailRef.current?.focus()
      } else if (message.includes('auth/missing-password')) {
        setError({ password: t('missing-password') })
        passwordRef.current?.focus()
      } else if (message.includes('auth/weak-password')) {
        setError({ password: t('weak-password') })
        passwordRef.current?.focus()
      }
    }
  }

  return (
    <ModalDialog
      isOpen={isOpen}
      aria-label={t('create-account')}
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
        <h2 className={styles.dialogHeader}>{t('heading')}</h2>
        <form>
          <div className={styles.field}>
            <Input
              ref={emailRef}
              type='text'
              id='signup-dialog-email'
              name='email'
              label={t('email')}
              value={email}
              error={error.email}
              onChange={(event: ChangeEvent<HTMLInputElement>) => { setEmail(event.target.value) }}
            />
          </div>
          <div className={styles.field}>
            <Input
              ref={passwordRef}
              type='password'
              id='signup-dialog-password'
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
            {t('create-account')}
          </Button>
        </form>
      </div>
    </ModalDialog>
  )
}

export default SignupDialog