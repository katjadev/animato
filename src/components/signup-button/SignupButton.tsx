'use client'

import { FC } from 'react'
import { AuthProvider } from '@animato/context/AuthContext'
import { DialogProvider, useDialog } from '@animato/context/DialogContext'
import Button from '@animato/components/button/Button'

export interface SignupButtonProps {
  children: React.ReactNode;
}

const SignupButtonComponent: FC<SignupButtonProps> = ({ children }) => {
  const { showSignupDialog } = useDialog()

  return (
    <Button 
      variant='primary'
      size='large'
      onClick={showSignupDialog}
    >
      {children}
    </Button>
  )
}

export default function SignupButton(props: SignupButtonProps) {
  return (
    <AuthProvider>
      <DialogProvider>
        <SignupButtonComponent {...props} />
      </DialogProvider>
    </AuthProvider>
  )
}
