'use client'

import { FC } from 'react'
import { AuthProvider } from '@animato/context/AuthContext'
import { DialogProvider, useDialog } from '@animato/context/DialogContext/DialogContextProvider'
import Button from '@animato/components/button/Button'

export interface LoginButtonProps {
  children: React.ReactNode;
}

const LoginButtonComponent: FC<LoginButtonProps> = ({ children }) => {
  const { showLoginDialog } = useDialog()

  return (
    <Button 
      variant='secondary-inverted' 
      size='medium'
      onClick={showLoginDialog}
    >
      {children}
    </Button>
  )
}

export default function LoginButton(props: LoginButtonProps) {
  return (
    <AuthProvider>
      <DialogProvider>
        <LoginButtonComponent {...props} />
      </DialogProvider>
    </AuthProvider>
  )
}