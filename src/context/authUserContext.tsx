import { ReactNode, createContext, useContext, useEffect, useState, FC } from 'react'
import { User, getAuth } from 'firebase/auth'

export const AuthUserContext = createContext<User | null>(null)

interface AuthUserProviderProps {
  children?: ReactNode;
}

export const AuthUserProvider: FC<AuthUserProviderProps> = ({ children }) => {
  const auth = getAuth()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setCurrentUser(auth.currentUser)
    })
  }, [auth])

  return (
    <AuthUserContext.Provider value={currentUser}>{children}</AuthUserContext.Provider>
  )
}

export const useAuth = () => useContext(AuthUserContext)