import { FC } from 'react'
import { useAuth } from '@animato/context/AuthContext'
import Button from '@animato/components/button/Button'

export interface LogoutButtonProps {
  children: React.ReactNode;
}

const LogoutButtonInner: FC<LogoutButtonProps> = ({ children }) => {
  const { logOut } = useAuth()

  return (
    <Button 
      variant='secondary-inverted' 
      size='medium'
      onClick={logOut}
    >
      {children}
    </Button>
  )
}

export default LogoutButtonInner