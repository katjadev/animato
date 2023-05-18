'use client'

import { FC } from 'react'
import { AuthProvider } from '@animato/context/AuthContext'
import LogoutButtonInner, { LogoutButtonProps } from './LogoutButtonInner'

const LogoutButton: FC<LogoutButtonProps> = ({ children }) => {
  return (
    <AuthProvider>
      <LogoutButtonInner>{children}</LogoutButtonInner>
    </AuthProvider>
  )
}

export default LogoutButton