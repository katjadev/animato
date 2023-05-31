'use client'

import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState,
  useRef,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import { NextIntlClientProvider } from 'next-intl'
import LoginDialog from '@animato/components/login-dialog/LoginDialog'
import SignupDialog from '@animato/components/signup-dialog/SignupDialog'
import ErrorDialog from '@animato/components/error-dialog/ErrorDialog'
import ConfirmationDialog from '@animato/components/confirmation-dialog/ConfirmationDialog'

export type ConfirmationDialogOptions = {
  title: string;
  content: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DialogContext = createContext<{
  showLoginDialog: () => void,
  showSignupDialog: () => void,
  showErrorDialog: (title: string, content: string | ReactNode) => void,
  showConfirmationDialog: (options: Partial<ConfirmationDialogOptions>) => Promise<void>,
}>({
  showLoginDialog: () => null,
  showSignupDialog: () => null,
  showErrorDialog: () => null,
  showConfirmationDialog: () => Promise.resolve(),
})

interface DialogProviderProps {
  children?: ReactNode;
}

const defaultConfirmationDialogOptions: ConfirmationDialogOptions = {
  title: '',
  content: '',
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  onConfirm: () => {},
  onCancel: () => {},
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false)
  const [errorDialogTitle, setErrorDialogTitle] = useState('')
  const [errorDialogContent, setErrorDialogContent] = useState<string | ReactNode>('')
  const [confirmationDialogOptions, setConfirmationDialogOptions] = useState<ConfirmationDialogOptions>(defaultConfirmationDialogOptions)

  const showLoginDialog = () => setIsLoginDialogOpen(true)
  const showSignupDialog = () => setIsSignupDialogOpen(true)
  const showErrorDialog = (title: string, content: string | ReactNode) => {
    setErrorDialogTitle(title)
    setErrorDialogContent(content)
    setIsErrorDialogOpen(true)
  }
  const closeErrorDialog = () => {
    setErrorDialogTitle('')
    setErrorDialogContent('')
    setIsErrorDialogOpen(false)
  }

  const closeConfirmationDialog = () => {
    setConfirmationDialogOptions(defaultConfirmationDialogOptions)
    setIsConfirmationDialogOpen(false)
  }
  
  const showConfirmationDialog = (options: Partial<ConfirmationDialogOptions>) => {
    return new Promise<void>((resolve, reject) => {
      const onConfirm = () => {
        closeConfirmationDialog()
        resolve()
      }
      const onCancel = () => {
        closeConfirmationDialog()
        reject()
      }
      setConfirmationDialogOptions({
        ...confirmationDialogOptions,
        ...options,
        onConfirm,
        onCancel,
      })
      setIsConfirmationDialogOpen(true)  
    })
  }

  const documentRef = useRef<Element | null>(null)
  const messagesRef = useRef({})
  useEffect(() => {
    documentRef.current = document.body

    const loadMessages = async () => {
      const locale = 'en'
      messagesRef.current = (await import(`../../messages/${locale}.json`)).default
    }
    loadMessages()
  }, [])

  return (
    <NextIntlClientProvider
      locale='en'
      messages={messagesRef.current}
    >
      <DialogContext.Provider value={{ 
        showLoginDialog, 
        showSignupDialog,
        showErrorDialog,
        showConfirmationDialog,
      }}>
        {children}
        {documentRef.current && createPortal(
          (
            <>
              {isSignupDialogOpen && (
                <SignupDialog
                  isOpen={true}
                  onClose={() => setIsSignupDialogOpen(false)} 
                />
              )}
              {isLoginDialogOpen && (
                <LoginDialog
                  isOpen={true}
                  onClose={() => setIsLoginDialogOpen(false)} 
                />
              )}
              {isErrorDialogOpen && (
                <ErrorDialog
                  isOpen={true}
                  title={errorDialogTitle}
                  content={errorDialogContent}
                  onClose={closeErrorDialog} 
                />
              )}
              {isConfirmationDialogOpen && (
                <ConfirmationDialog
                  isOpen={true}
                  {...confirmationDialogOptions}
                />
              )}
            </>
          ),
          documentRef.current
        )}
      </DialogContext.Provider>
    </NextIntlClientProvider>
  )
}

export const useDialog = () => useContext(DialogContext)